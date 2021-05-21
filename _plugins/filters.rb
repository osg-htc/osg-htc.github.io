module OSG
  # Adding useful filters
  module Filters
    def values(input)
        input.values
    end
  end
end

Liquid::Template.register_filter(OSG::Filters)