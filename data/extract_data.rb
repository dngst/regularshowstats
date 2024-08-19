require 'nokogiri'
require 'csv'
require 'open-uri'

def extract_wikipedia_tables(url, table_selector)
  doc = Nokogiri::HTML(URI.open(url))

  tables = doc.css(table_selector)

  tables.each_with_index do |table, table_index|
    if (3..10).include?(table_index) 
      CSV.open("season_#{table_index - 2}.csv", "wb") do |csv|
        table.css('tr').each do |row|
          csv << row.css('th, td').map do |cell| 
            text = cell.text.strip
            text.gsub!(/\[\d+\]/, '') 
            text
          end
        end
      end
    end
  end
end

wikipedia_url = "https://en.wikipedia.org/wiki/List_of_Regular_Show_episodes"
table_selector = "table.wikitable"  

extract_wikipedia_tables(wikipedia_url, table_selector)
