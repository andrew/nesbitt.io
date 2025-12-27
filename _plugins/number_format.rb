module Jekyll
  module NumberFormat
    def number_with_commas(input)
      input.to_s.gsub(/(\d)(?=(\d{3})+(?!\d))/, '\\1,')
    end
  end
end

Liquid::Template.register_filter(Jekyll::NumberFormat)
