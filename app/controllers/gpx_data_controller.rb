class GpxDataController < ApplicationController
  def new
    
    if cookies[:user_id] == nil
      cookies[:user_id] = (0...8).map { (65 + rand(26)).chr }.join
    end
    
    file = params[:file]
    if file != nil and file != "null"
      begin
        gpxdatum = GpxDatum.new
        gpxdatum.file = file
        gpxdatum.name = cookies[:user_id]
        gpxdatum.date = Time.now
        gpxdatum.save!
        result = IO.readlines(file.tempfile.path).join("")
        render :json => {file: result}
        
      rescue RecordError
        # rescue
      end
    end
  end

  def all

    if cookies[:user_id] == nil
      render :json => {}
    else
      render :json => GpxDatum.where(name: cookies[:user_id]).all.to_json(:only => [:id, :date])
    end
  end

  def show

    user_id = cookies[:user_id]

    data = GpxDatum.where(name: user_id, :id => params[:id].to_i).first
    if(data != nil)
      result = IO.readlines(data.file.path).join("")
      render :json => { file: result }
    end

  end
  
end
