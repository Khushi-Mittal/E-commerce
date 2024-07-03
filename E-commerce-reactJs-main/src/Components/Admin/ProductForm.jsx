import { useForm } from "react-hook-form";
import {
  createProductAsync,
  fetchProductByIdAsync,
  selectFilters,
  selectProductById,
  updateProductAsync,
} from "../../Store/productSlice";
import Dropzone from "../Dropzone/Dropzone";
import { useSelector, useDispatch } from "react-redux";
import { useParams,Link } from "react-router-dom";
import { useEffect,useState } from "react";
export default function ProductForm() {
  const filters = useSelector(selectFilters);
  const companies = filters[0].options;
  const category = filters[1].options;
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const handleDelete = ()=>{
    const product = {...selectedProduct,deleted:true};
    dispatch(updateProductAsync(product))

  }
  const id = useParams().id;
  console.log(id);
  useEffect(() => {
    if(id)
    dispatch(fetchProductByIdAsync(id));
  }, [id]);


  const selectedProduct = useSelector(selectProductById);
  console.log(selectedProduct)


  const [images,setImages] = useState([
    (selectedProduct && selectedProduct.thumbnail) ? selectedProduct.thumbnail : "x",
  (selectedProduct && selectedProduct.images) ? selectedProduct.images[0] : "x",
  (selectedProduct && selectedProduct.images) ? selectedProduct.images[1] : "x",
  (selectedProduct && selectedProduct.images) ? selectedProduct.images[2] : "x",
  (selectedProduct && selectedProduct.images) ? selectedProduct.images[3] : "x",
  ]);
  useEffect(() => {
    if (selectedProduct) {
      setValue("name", selectedProduct.name);
      setValue("description", selectedProduct.description);
      setValue("price", selectedProduct.price);
      setValue("averageRating", selectedProduct.averageRating);
      setValue("discountPercentage", selectedProduct.discountPercentage);
      setValue("thumbnail", selectedProduct.thumbnail);
      setValue("inventory", selectedProduct.inventory);
      setValue("company", selectedProduct.company);
      setValue("category", selectedProduct.category);

      setImages([
        (selectedProduct && selectedProduct.thumbnail) ? selectedProduct.thumbnail : "",
      (selectedProduct && selectedProduct.images) ? selectedProduct.images[0] : "",
      (selectedProduct && selectedProduct.images) ? selectedProduct.images[1] : "",
      (selectedProduct && selectedProduct.images) ? selectedProduct.images[2] : "",
      (selectedProduct && selectedProduct.images) ? selectedProduct.images[3] : "",
      ])
    }
  }, [selectedProduct]);

  if( id && Object.keys(selectedProduct).length===0)
  return <div>Loading</div>

  return (
    <form
      className="bg-white p-8"
      onSubmit={handleSubmit((data) => {
        let product = { ...data };
        product.images = images.slice(1)
        delete product["image1"];
        delete product["image2"];
        delete product["image3"];
        delete product["image4"];
        delete product.thumbnail;
        product.thumbnail = images[0];
        console.log(product);
        if (id) {
          product._id = id;
          product.averageRating =
            selectedProduct.averageRating
            dispatch(updateProductAsync(product));
          console.log("update",product);
        } else {
          dispatch(createProductAsync(product));

        }
        reset();
      })}
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Add / Update Product
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            please fill in the product details
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    {...register("name")}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="product title"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    {...register("description")}
                    id="description"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="product description"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    {...register("price")}
                    id="price"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="product price"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="discountPercentage"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Discount Percentage
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    {...register("discountPercentage")}
                    id="discountPercentage"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="discount percentage"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="rating"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Rating
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    {...register("averageRating")}
                    id="rating"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="product rating"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="stock"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Stock
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    {...register("inventory")}
                    id="stock"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="product stock"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="brand"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company
              </label>
              <div className="mt-2">
                <select className="rounded-lg" {...register("company")}>
                  {companies.map((brand) => (
                    <option value={brand.value}>{brand.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="brand"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Category
              </label>
              <div className="mt-2 rounded">
                <select className="rounded-lg" {...register("category")}>
                  {category.map((category) => (
                    <option value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>{" "}
        <div>
        <p>Thumbnail</p>
            <Dropzone setImages={setImages} images={images} idx={0}/>
        </div>
        <div className="flex gap-2">
            {[1,2,3,4].map((x)=>
            <div key={x}>
             <p className="text-center"> image {x}</p>
            <Dropzone setImages={setImages} idx={x} images={images}/>
            </div>
            )}
        </div>
        <div className="flex gap-3 flex-wrap">

        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Delete
        </button>
        <Link to="/admin">
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Cancel
        </button></Link>
        </div>
      </div>
    </form>
  );
}

// {
//     "title": "iPhone 9",
//     "description": "An apple mobile which is nothing like apple",
//     "price": 549,
//     "discountPercentage": 12.96,
//     "rating": 4.69,
//     "stock": 94,
//     "brand": "Apple",
//     "category": "smartphones",
//     "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
//     "images": [
//       "https://i.dummyjson.com/data/products/1/1.jpg",
//       "https://i.dummyjson.com/data/products/1/2.jpg",
//       "https://i.dummyjson.com/data/products/1/3.jpg",
//       "https://i.dummyjson.com/data/products/1/4.jpg",
//       "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
//     ],
//     "quantity": 5,
//     "user": 1,
//     "id": 1
//   }
