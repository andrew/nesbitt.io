Jekyll::Hooks.register :site, :post_write do |site|
  payload = site.site_payload

  documents = site.pages.select { |page| page.data["raw_markdown"] } + site.posts.docs
  documents.each do |doc|
    source_path = doc.path.start_with?("/") ? doc.path : site.in_source_dir(doc.path)
    source = File.read(source_path)
    body = source.sub(/\A---\n.*?\n---\n+/m, "")
    payload["page"] = doc.to_liquid
    body = Liquid::Template.parse(body).render!(payload, registers: { site: site, page: doc })
    body = body.gsub(%r{<script\b.*?</script>\s*}m, "")
    canonical = File.join(site.config["url"], doc.url)
    footer = "\n---\n\nBy #{site.config["author"]["name"]} (#{site.config["url"]}). Markdown version of #{canonical}\n"
    dest = site.in_dest_dir(doc.url.chomp("/").sub(/\.html\z/, "") + ".md")
    File.write(dest, "# #{doc.data["title"]}\n\n#{body.chomp}\n#{footer}")
  end
end
