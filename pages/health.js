import React from "react";
import { useState, useEffect } from 'react';
import clientPromise from "../utils/mongo";
 
export default function Health() {
  const [displayDiv,setDisplayDiv] = useState(<div></div>);

  async function getRestaurants(){
    try {
      const client = await clientPromise;
      const db = client.db("sample_airbnb");
    
      const movies = await db
        .collection("listingAndReviews")
        .find({})
        .sort({ _id: -1 })
        .limit(20)
        .toArray();
    
        // console.log( {
        //     props: { movies: JSON.parse(JSON.stringify(movies)) },
        // }) 
      return movies;
    } catch (e) {
        console.error(e);
    }
  }

  //listener for esc ket close modal
  useEffect(() => {
    getRestaurants().then(resp =>{
      console.log(resp);
      setDisplayDiv(<div>Displayed</div>)
    });
  }, [isConnected]);

 
  return (
    <div>
      { displayDiv }
    </div>
  )
}