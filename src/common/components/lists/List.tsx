import CardContent from "../CardContent";

const List: React.FC<{
  className?: string;
  onClickShowAll?: () => void;
  // TODO: These are not in use. Remove or use?
  showPagination?: boolean;
  showShowAll?: boolean;
}> = ({ children, onClickShowAll, showPagination, showShowAll, className }) => (
  <>
    <CardContent
      className={`flex flex-col mx-auto items-center justify-center ${
        className || ""
      }`}
    >
      <ul className="flex flex-col divide divide-y w-full">{children}</ul>
    </CardContent>
    {/* TODO PANU: use pagination */}
    {showPagination && (
      <div className="flex flex-col items-center mt-4 mb-2">
        <div className="flex text-gray-700">
          <div className="h-8 w-8 mr-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-left w-4 h-4"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
          <div className="flex h-8 font-medium rounded-full bg-gray-200">
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              1
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              ...
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              3
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full bg-purple-600 text-white ">
              4
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              5
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              ...
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              15
            </div>
          </div>

          <div className="h-8 w-8 ml-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-right w-4 h-4"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    )}

    {showShowAll && (
      <div className="text-gray-600 text-xs w-100 text-right">
        <div onClick={onClickShowAll} className="cursor-pointer">
          Show all
        </div>
      </div>
    )}
  </>
);

export default List;
