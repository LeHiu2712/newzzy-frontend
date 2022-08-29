import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
export default function UpdateImage() {
    const currentUser = JSON.parse(localStorage.getItem("user"))
    const updateImage = (data) => {
        console.log("hello from upadte")
        const formData = new FormData();
    
        formData.append("image", data.image[0]);
        console.log(data)
        fetch(`http://localhost:9000/user/${currentUser.id}/imageupdate`, {
    
          method: 'PUT',
          body: formData
    
        }).then(response => response.json())
          .then(result => window.location.reload())
      }
      const validationSchema = Yup.object().shape({
        image: Yup.mixed()
          .test("fileName", "Image is required", (value) => {
            if (value.length) {
              return true // attachment is optional
            }
            return false
          })
    
          .test("fileSize", "The file is too large", (value) => {
            if (!value.length) {
              return true // attachment is optional
            }
            return value[0].size <= 2000000
          })
          .test("fileType", "Only jpeg/png file is accepted", (value) => {
            if (!value.length) {
              return true // attachment is optional
            }
            return value[0].type === "image/jpeg" || value[0].type === "image/png"
          })
      });
      const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
      });
    
    return (
        <>
            <div class="img-button">

                <button id="userId-avatar" class="btn hover-button  " value="avatar" data-bs-toggle="modal" data-bs-target="#editAvatar">

                    <i name="camera-outline" class="far fa-edit" style={{ "font-size": "30px" }}></i>

                </button>

            </div>
            {/* Update Avatar modal */}
            <div class="modal fade" id="editAvatar" tabindex="-1" aria-labelledby="editAvatarLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" style={{ color: "black" }} id="exampleModalLabel">CHANGE PROFILE PICTURE</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit(updateImage)} enctype="multipart/form-data">
                            <div class="modal-body">
                                <div className="row">
                                    <div class="form-group mb-3 col-6">
                                        <div class="custom-file">
                                            <label class="custom-file-label" style={{ color: "black" }} for="inputGroupFile01">Upload Image</label><br />
                                            <input type="file" name="image" style={{ color: "black" }} class={`custom-file-input ${errors.image ? 'is-invalid' : ''}`} id="inputGroupFile01" {...register('image')} />
                                            <div className="invalid-feedback">{errors.image?.message}</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                &nbsp;&nbsp;
                                <button type="submit" class="btn btn-primary">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}