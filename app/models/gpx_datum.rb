class GpxDatum < ApplicationRecord
  mount_uploader :file, GpxUploaderUploader
end
