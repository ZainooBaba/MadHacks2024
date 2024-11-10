import React from 'react';

const Transaction = ({ title, creator, amount, description, members }) => {
  return (
    <div className="flex flex-col w-full max-w-[1000px] px-10 bg-gray-100 rounded-xl py-5 shadow-md duration-500 hover:scale-[1.01] hover:bg-gray-200 hover:-translate-y-1 space-y-2">
      <div className="flex flex-row justify-between ml-5">
        <h3 className="font-bold text-[30px] untext">{title}</h3>
        <span className="text-gray-600 font-semibold text-[30px] untext">${amount}</span>
      </div>
      <div className="flex flex-row justify-start ml-5">
        <h4 className="font-semibold text-[20px] text-gray-400 untext">Created by: {creator}</h4>
      </div>
      <div className="ml-5 text-[18px] tracking-medium text-gray-600 untext">
        {description}
      </div>
      <div className="ml-5 text-[16px] text-gray-500">
        <strong className='untext'>Dependents:</strong> {members.join(', ')}
      </div>
    </div>
  );
};

export default Transaction;
