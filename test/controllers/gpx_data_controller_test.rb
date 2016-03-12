require 'test_helper'

class GpxDataControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get gpx_data_new_url
    assert_response :success
  end

end
