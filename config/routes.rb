Rails.application.routes.draw do

  post 'gpx_data/new' 
  get 'gpx_data/all' 
  get 'gpx_data/:id', to: "gpx_data#show"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # Serve websocket cable requests in-process
  # mount ActionCable.server => '/cable'
end
