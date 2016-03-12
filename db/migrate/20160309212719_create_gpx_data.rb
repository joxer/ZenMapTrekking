class CreateGpxData < ActiveRecord::Migration[5.0]
  def change
    create_table :gpx_data do |t|
      t.string :name
      t.date :date
      t.string :file

      t.timestamps
    end
  end
end
