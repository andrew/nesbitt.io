Jekyll::Hooks.register :site, :post_write do |site|
  payload = site.site_payload

  site.pages.each do |page|
    next unless page.data["raw_markdown"]

    source = File.read(site.in_source_dir(page.path))
    body = source.sub(/\A---\n.*?\n---\n+/m, "")
    payload["page"] = page.to_liquid
    body = Liquid::Template.parse(body).render!(payload, registers: { site: site, page: page })
    body = body.gsub(%r{<script\b.*?</script>\s*}m, "")
    canonical = File.join(site.config["url"], page.url)
    footer = "\n---\n\nBy #{site.config["author"]["name"]} (#{site.config["url"]}). Markdown version of #{canonical}\n"
    dest = site.in_dest_dir(page.url.chomp("/") + ".md")
    File.write(dest, "# #{page.data["title"]}\n\n#{body.chomp}\n#{footer}")
  end
end
