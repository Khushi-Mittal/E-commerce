import React, { useState, useEffect, useCallback } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import { Cloudinary } from "@cloudinary/url-gen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dropzone({ setImages, idx, images }) {
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg,image/png",
  });
  const [files, setFiles] = useState([images ? images[idx] : ""]);

  useEffect(() => {
    setFiles([images[idx]])
  }, [images])

  console.log(images, idx);
  console.log(files)
  let thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img src={file.preview ? file.preview : file} />
      </div>
    </div>
  ));

  return (
    <>
      <ToastContainer />
      <div
        className="h-48 w-48 border flex items-center justify-center cursor-pointer"
        {...getRootProps()}
      >
        <input {...getInputProps()} placeholder="upload file" />
        <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
      </div>
      <aside className="h-48 w-48">
        {
            files.map((file) => (
                <div key={file.name}>
                  <div>
                    <img src={file.preview ? file.preview : file} />
                  </div>
                </div>))
        }
      </aside>

      {files.length > 0 && (
        <button
          onClick={async () => {
            const url =
              "https://api.cloudinary.com/v1_1/dstos3wub/image/upload";
            const formData = new FormData();
            // Use the first item to upload
            let file = files[0];
            formData.append("file", file);
            formData.append("upload_preset", "vyvkm8op");
            formData.append("cloud_name", "dstos3wub");
            try {
              const res = await fetch(url, {
                method: "POST",
                body: formData,
              });
              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
              const data = await res.json();
              let newImages = images;
              newImages[idx] = data.url;
              setImages(newImages);
              console.log(images);
              toast.success("Image Uploaded Successfully");
            } catch (error) {
              toast.error("Error While Uploading");
            }
          }}
          className="bg-green-300 px-3 py-1 rounded-xl"
          type="button"
        >
          Upload
        </button>
      )}
    </>
  );
}
