import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MdFastfood,
  MdCloudUpload,
  MdDelete,
  MdFoodBank,
} from "react-icons/md";
import { BiRupee } from "react-icons/bi";
import { categories } from "../utils/data";
import {
  setTitle,
  setCategory,
  setCalories,
  setPrice,
  setImageAsset,
  setFields,
  setAlertStatus,
  setMsg,
  setIsLoading,
} from "../reducers/createItemSlice";
import { storage } from "../firebase.config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getAllFoodItems, saveItem } from "../utils/firebaseFunctions";
import { setFoodItems, setIsMenuOpen } from "../reducers/userSlice";

const CreateContainer = () => {
  const {
    title,
    category,
    calories,
    price,
    imageAsset,
    fields,
    alertStatus,
    msg,
    isLoading,
  } = useSelector((state) => state.newItem);
  const { isMenuOpen } = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const imgRef = useRef();
  const alertRef = useRef();

  const uploadImage = (e) => {
    dispatch(setIsLoading(true));
    const imageFile = e.target.files[0];
    // const storageRef = ref(storage, `Images/${imageFile.name}`);
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      // (snapshot) => {
      //   // const uploadProgress =
      //   //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // },
      (error) => {
        console.log(error);
        dispatch(setFields(true));
        dispatch(setMsg("Error while uploading image : Try Again 🙇"));
        dispatch(setAlertStatus("danger"));
        setTimeout(() => {
          alertRef.current.classList.add("closeAnimation"); //for closing animation
          setTimeout(() => {
            dispatch(setFields(false));
            alertRef.current.classList.remove("closeAnimation");
          }, 200);
          dispatch(setIsLoading(false));
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          dispatch(setImageAsset(downloadURL));
          dispatch(setIsLoading(false));
          dispatch(setFields(true));
          dispatch(setMsg("Image uploaded successfully 😊"));
          dispatch(setAlertStatus("success"));
          setTimeout(() => {
            alertRef.current.classList.add("closeAnimation"); //for closing animation
            setTimeout(() => {
              dispatch(setFields(false));
              alertRef.current.classList.remove("closeAnimation");
            }, 200);
          }, 4000);
        });
      }
    );
  };

  const deleteImage = () => {
    dispatch(setIsLoading(true));
    const deleteRef = ref(storage, imageAsset);
    deleteObject(deleteRef).then(() => {
      dispatch(setImageAsset(null));
      dispatch(setIsLoading(false));
      dispatch(setFields(true));
      dispatch(setMsg("Image deleted successfully 😊"));
      dispatch(setAlertStatus("success"));
      setTimeout(() => {
        alertRef.current.classList.add("closeAnimation"); //for closing animation
        setTimeout(() => {
          dispatch(setFields(false));
          alertRef.current.classList.remove("closeAnimation");
        }, 200);
      }, 4000);
    });
  };

  const saveDetails = () => {
    dispatch(setIsLoading(true));
    try {
      if (
        !title ||
        (!category && category !== "Select Category") ||
        !imageAsset ||
        !calories ||
        !price
      ) {
        dispatch(setFields(true));
        dispatch(setMsg("Required fields can't be empty"));
        dispatch(setAlertStatus("danger"));
        setTimeout(() => {
          alertRef.current.classList.add("closeAnimation"); //for closing animation
          setTimeout(() => {
            dispatch(setFields(false));
            alertRef.current.classList.remove("closeAnimation");
          }, 200);
          dispatch(setIsLoading(false));
        }, 4000);
      } else {
        const data = {
          id: `${Date.now()}`,
          title: title,
          imageURL: imageAsset,
          category: category,
          calories: calories,
          qty: 1,
          price: price,
        };
        saveItem(data);
        dispatch(setIsLoading(false));
        dispatch(setFields(true));
        dispatch(setMsg("Data uploaded successfully 😊"));
        dispatch(setAlertStatus("success"));
        clearData();
        setTimeout(() => {
          alertRef.current.classList.add("closeAnimation"); //for closing animation
          setTimeout(() => {
            dispatch(setFields(false));
            alertRef.current.classList.remove("closeAnimation");
          }, 200);
        }, 4000);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      dispatch(setFields(true));
      dispatch(setMsg("Error while uploading : Try Again 🙇"));
      dispatch(setAlertStatus("danger"));
      setTimeout(() => {
        alertRef.current.classList.add("closeAnimation"); //for closing animation
        setTimeout(() => {
          dispatch(setFields(false));
          alertRef.current.classList.remove("closeAnimation");
        }, 200);
        dispatch(setIsLoading(false));
      }, 4000);
    }
  };

  const clearData = () => {
    dispatch(setTitle(""));
    dispatch(setImageAsset(null));
    dispatch(setCalories(""));
    dispatch(setPrice(""));
    dispatch(setCategory(null));

    document.getElementById("categoryList").selectedIndex = 0;
  };

  const fetchData = async () => {
    await getAllFoodItems().then((data) => {
      dispatch(setFoodItems(data));
    });
  };

  const closeMenu = () => {
    const userDropdown = document.querySelector(".user-dropdown-menu");
    userDropdown.classList.remove("openMenu");

    const transitionDuration =
      parseFloat(
        window
          .getComputedStyle(userDropdown)
          .getPropertyValue("transition-duration")
      ) * 1000;
    setTimeout(() => {
      userDropdown.style.display = "none"; //for closing animation

      dispatch(setIsMenuOpen(false));
    }, transitionDuration);
  };

  return (
    <section
      className="create-container"
      onClick={() => {
        if (isMenuOpen) {
          closeMenu();
        }
      }}
    >
      <div className="create-item">
        {fields && (
          <p ref={alertRef} className={`${alertStatus} alert-message`}>
            {msg}
          </p>
        )}
        <div className="newItem-textfield">
          <MdFastfood className="newItem-icon" />
          <input
            type="text"
            required
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            placeholder="Give me a title..."
          />
        </div>
        <select
          name=""
          id="categoryList"
          className="category-list"
          onChange={(e) => dispatch(setCategory(e.target.value))}
        >
          <option value="Select Category">Select Category</option>
          {categories.map((category) => {
            const { id, name, urlParamName } = category;
            return (
              <option value={urlParamName} key={id}>
                {name}
              </option>
            );
          })}
        </select>
        <div className="newItem-img-container">
          {isLoading ? (
            <label>
              <div className="loader"></div>
            </label>
          ) : (
            <>
              {!imageAsset ? (
                <label
                  className="newItem-img-upload"
                  onClick={() => imgRef.current.focus()}
                >
                  <input
                    type="file"
                    name="uploadImage"
                    accept="Images/*"
                    ref={imgRef}
                    onChange={uploadImage}
                  />
                  <MdCloudUpload className="upload-icon" />
                  <p>Click here to upload</p>
                </label>
              ) : (
                <div className="newItem-img-display">
                  <img src={imageAsset} alt="item" className="item-image" />
                  <button className="image-delete-btn" onClick={deleteImage}>
                    <MdDelete className="delete-icon" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="newItem-details">
          <div className="newItem-textfield">
            <MdFoodBank className="newItem-icon" />
            <input
              type="number"
              required
              placeholder="Calories"
              value={calories}
              min="0"
              onChange={(e) => dispatch(setCalories(e.target.value))}
            />
          </div>
          <div className="newItem-textfield">
            <BiRupee className="newItem-icon" />
            <input
              type="number"
              required
              placeholder="Price"
              value={price}
              min="0"
              onChange={(e) => dispatch(setPrice(e.target.value))}
            />
          </div>
        </div>
        <button className="save-btn" onClick={saveDetails}>
          save
        </button>
      </div>
    </section>
  );
};

export default CreateContainer;
