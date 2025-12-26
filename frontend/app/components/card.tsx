export default function Card({children}:any){//children ->data type any
    return(
        <div className = "bg-white shadow-xl rounded-2xl p-6 w-[360px] border border-pink-100">
          {children}
        </div>

    );
}