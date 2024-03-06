import React from "react";
import { getSingleTour } from "@/utils/action";
import { redirect } from "next/navigation";
import Link from "next/link";
import TourInfo from "@/components/TourInfo";
import { generateTourImage } from "@/utils/action";
import Image from "next/image";
import axios from "axios";
const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;

const SingleTourPage = async ({ params }) => {
  // console.log(params) = { id: '4d19099c-5264-4279-b838-7821b5be3b34' }
  // so to extract id, has to be params.id

  // the "params" object in the SingleTourPage component is provided by
  // the Next.js router.

  // For example, if you have a dynamic route like /tours/[tourId].js,
  // where tourId is a dynamic segment, and you navigate to /tours/123,
  // Next.js will automatically provide the value 123 as a parameter to
  // the component in the params object.

  const tour = await getSingleTour(params.id);
  if (!tour) {
    redirect("/tours");
  }
  //   const tourImage = await generateTourImage({
  //     city: tour.city,
  //     country: tour.country,
  //   });
  const { data } = await axios(`${url}${tour.city}`);
  const tourImage = data?.results[0]?.urls?.raw;

  return (
    <div>
      <Link href="/tours" className="btn btn-secondary mb-12">
        back to tours
      </Link>
      {tourImage ? (
        <div>
          <Image
            src={tourImage}
            width={300}
            height={300}
            className="rounded-xl shadow-xl mb-16 h-96 w-96 object-cover"
            alt={tour.title}
            priority
          />
        </div>
      ) : null}
      <TourInfo tour={tour} />
    </div>
  );
};

export default SingleTourPage;
