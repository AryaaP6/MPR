import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "SkillSphere");

  try {
    const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dxd4khdyc/image/upload" , 
        data
    );
    console.log("Cloudinary Response:", res.data);

    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
};

export default upload;