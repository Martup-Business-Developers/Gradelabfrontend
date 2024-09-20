"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { currencySymbol, serverURL } from "@/utils/utils";
import { FiChevronLeft, FiDownload, FiShoppingBag } from "react-icons/fi";

export default function Page() {
    const [data, setData] = useState([]);

    const getData = async () => {
        const config = {
            method: "GET",
            url: `${serverURL}/shop/purchases`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        };

        axios(config)
            .then((response) => {
                setData(response.data);
            })
    }

    useEffect(() => {
        getData();
    }, []);

    return <main className="flex flex-col w-screen h-screen bg-base-100 p-4 overflow-hidden">
       <div className='flex items-center text-lg'><button className='btn btn-sm btn-square text-lg mr-2' onClick={() => { window.history.back() }}><FiChevronLeft /></button> <p className="flex items-center"><FiShoppingBag className="mr-2" /> Purchases</p></div>
        <div className="overflow-x-auto mt-5">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Purchase Date</th>
                        <th>Item</th>
                        <th>Total Price</th>
                        <th>Payment Method</th>
                        <th>Invoice</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item: any, i: number) => {
                            return <tr className='hover'>
                                <th>1</th>
                                <td>{item?.date}</td>
                                <td>{item?.item}</td>
                                <td>{currencySymbol} {item?.amount}</td>
                                <td>{item?.paymentMethod}</td>
                                <td><Link href={"/invoice/" + item._id}><button className='btn btn-md'><FiDownload /></button></Link></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </main>
}

