require "json"
require "tmpdir"
require "fileutils"
require "open3"
require "rbconfig"

builder = File.expand_path("../cwe/build.rb", __dir__)

Dir.mktmpdir("cwe-build-test") do |dir|
  output = File.join(dir, "output.json")
  cves = File.join(dir, "cvelistV5-main/cves/2099/0xxx")
  FileUtils.mkdir_p(cves)
  File.write(File.join(dir, "cwec_v4.19.1.xml"), <<~XML)
    <Weakness_Catalog xmlns="http://cwe.mitre.org/cwe-7" Version="4.19.1">
      <Weaknesses>
        <Weakness ID="79" Name="Cross-site Scripting" Abstraction="Base" Status="Stable"/>
        <Weakness ID="89" Name="SQL Injection" Abstraction="Base" Status="Stable"/>
        <Weakness ID="20" Name="Improper Input Validation" Abstraction="Class" Status="Stable"/>
      </Weaknesses>
      <Categories>
        <Category ID="1396" Name="Access Control" Status="Stable">
          <Relationships>
            <Has_Member CWE_ID="79" View_ID="1400"/>
            <Has_Member CWE_ID="89" View_ID="1400"/>
            <Has_Member CWE_ID="20" View_ID="1400"/>
          </Relationships>
        </Category>
      </Categories>
      <Views>
        <View ID="1400" Name="Test view">
          <Members><Has_Member CWE_ID="1396"/></Members>
        </View>
      </Views>
    </Weakness_Catalog>
  XML

  problem_types = ->(*ids) do
    [{ "descriptions" => ids.map { |id| { "lang" => "en", "type" => "CWE", "cweId" => id } } }]
  end
  records = [
    { "cna" => { "problemTypes" => problem_types.call("CWE-79", "CWE-89") },
      "adp" => [{ "problemTypes" => problem_types.call("CWE-79", "CWE-79") }] },
    { "cna" => { "problemTypes" => problem_types.call("CWE-79") } },
    { "cna" => {} }
  ]
  records.each_with_index do |containers, i|
    id = "CVE-2099-000#{i + 1}"
    File.write(File.join(cves, "#{id}.json"), JSON.generate({
      "dataType" => "CVE_RECORD", "dataVersion" => "5.1",
      "cveMetadata" => { "cveId" => id, "state" => "PUBLISHED" },
      "containers" => containers
    }))
  end

  stdout, stderr, status = Open3.capture3(RbConfig.ruby, builder, dir, output)
  raise "Builder failed: #{stdout}\n#{stderr}" unless status.success?
  data = JSON.parse(File.read(output))
  leaves = data.fetch("tree").fetch("children").flat_map { |category| category.fetch("children") }
  counts = leaves.to_h { |leaf| [leaf.fetch("id"), leaf.fetch("count")] }
  raise "Duplicate references counted: #{counts.inspect}" unless counts == { "CWE-79" => 2, "CWE-89" => 1, "CWE-20" => 0 }
  raise "Incorrect record total" unless data.fetch("cve_files") == 3
  raise "Incorrect reference total" unless data.fetch("total_refs") == 3
  raise "Top count disagrees with map" unless data.fetch("top").first.fetch("count") == 2
  raise "Zero-count weakness is invisible" unless leaves.last.fetch("value") == 1
  raise "Missing generation date" unless data.fetch("generated").match?(/\A\d{4}-\d{2}-\d{2}T/)

  FileUtils.rm_r(File.join(dir, "cvelistV5-main"))
  before = File.read(output)
  _, stderr, status = Open3.capture3(RbConfig.ruby, builder, dir, output)
  raise "Missing CVE data must fail" if status.success?
  raise "Missing CVE error is unclear" unless stderr.include?("CVE directory not found")
  raise "Failed build replaced the output" unless File.read(output) == before

  FileUtils.mkdir_p(cves)
  _, stderr, status = Open3.capture3(RbConfig.ruby, builder, dir, output)
  raise "Empty CVE data must fail" if status.success?
  raise "Empty CVE error is unclear" unless stderr.include?("No CVE records found")
  raise "Empty build replaced the output" unless File.read(output) == before
end

puts "cwe_build_test.rb ok"
