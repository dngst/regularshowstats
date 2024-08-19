require 'csv'

csv_files = Dir.glob('season_*.csv')

def calculate_average_viewers(file)
  rows = CSV.read(file)
  viewership_column_index = rows.first.size - 1
  viewership_values = rows[1..-1].map { |row| row[viewership_column_index].to_f }
  average = viewership_values.sum / viewership_values.size
  average.round(2)
end

CSV.open("average_viewership.csv", "w") do |csv|
  csv << ["Season", "Average Viewership"]
end

csv_files.each do |file|
 average_viewers = calculate_average_viewers(file)
  season_number = file.match(/season_(\d+)\.csv/)[1]

  CSV.open("average_viewership.csv", "a") do |csv|
    csv << [season_number, average_viewers]
  end
end


