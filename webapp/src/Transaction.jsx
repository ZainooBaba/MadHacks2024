import React from "react";

const Transaction = (props) => {
  return (
    <div
      className="flex flex-row w-full bg-gray-100 rounded-xl py-5 shadow-md duration-500 hover:scale-[1.01]
		hover:bg-gray-200 hover:-translate-y-1 space-x-5"
    >
      <div className="flex flex-col ">
        <div className=" flex flex-row justify-start ml-5">
          <h3 className="font-bold text-[30px]">{props.title}</h3>
        </div>
        <div className=" flex flex-row justify-start ml-5">
          <h4 className=" font-semibold text-[20px] text-gray-400">
            Created by: {props.creator}
          </h4>
        </div>
      </div>
	  <div className=" text-[18px] tracking-medium text-gray-400">
		{props.description}
	  </div>
    </div>
  );
};

export default Transaction;
