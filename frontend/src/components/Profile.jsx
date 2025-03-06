import { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../context/AuthContext";

const Profile = () => {
  const { getDoctorInfo, updateDoctorInfo, user } = useContext(AuthContext);
  const [doctorInfo, setDoctorInfo] = useState(null);
  

  const [isEditing, setIsEditing] = useState({ location: false, availability: false });
  const [newData, setNewData] = useState({ location: "", availability: "" });

  const popoverRef = useRef(null);

  useEffect(() => {
    if (user?.role === "doctor" && user?._id && !doctorInfo) {
      getDoctorInfo(user?._id)
        .then((data) => {
          setDoctorInfo(data.doctor);
        })
        .catch((error) => {
          console.error("Get doctor info error:", error);
        });
    }
  }, [user, doctorInfo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsEditing({ location: false, availability: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleSave = async (field) => {
    try {
      const updatedValue = newData[field] || doctorInfo[field];

      console.log(doctorInfo?._id);

      await updateDoctorInfo(doctorInfo?._id, { [field]: updatedValue });
   
      setDoctorInfo((prev) => ({
        ...prev,
        [field]: updatedValue,
      }));

      setIsEditing({ ...isEditing, [field]: false });
    } catch (error) {
      console.error("Error updating doctor info:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-around items-center bg-white shadow-md rounded-lg p-6">
      <img
        src="https://www.sonicseo.com/wp-content/uploads/2020/07/surgeon-768x768.jpg"
        alt="Profile"
        className="w-40 h-40 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full object-cover mb-4 md:mb-0"
      />
      <div className="text-center md:text-left">
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
          {user?.name}
        </h2>
        <p className="text-blue-600 mt-2 text-sm sm:text-base md:text-lg">
          {user?.email}
        </p>

        {user?.role === "doctor" && doctorInfo && (
          <>
            <p className="text-gray-700 mt-2 text-sm sm:text-base md:text-lg">
              {doctorInfo.specialty}
            </p>

            {/* Location Section */}
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:space-x-6 mt-4">
              <p className="text-gray-700 text-sm sm:text-base md:text-lg">
                <span className="font-medium">Location:</span> {doctorInfo.location}
              </p>
              <button
                onClick={() => setIsEditing({ location: true, availability: false })}
                className="bg-[#6794ab] text-white px-4 py-1 rounded-md cursor-pointer transition hover:bg-[#4f7a94]"
              >
                Change
              </button>

              {isEditing.location && (
                <div ref={popoverRef} className="absolute top-12 left-0 bg-white shadow-md p-4 rounded-lg w-64 z-10">
                  <input
                    type="text"
                    placeholder="Enter new location"
                    value={newData.location}
                    onChange={(e) => setNewData({ ...newData, location: e.target.value })}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button onClick={() => setIsEditing({ ...isEditing, location: false })} className="text-gray-600">
                      Cancel
                    </button>
                    <button onClick={() => handleSave("location")} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Availability Section */}
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:space-x-6 mt-4">
              <p className="text-gray-700 text-sm sm:text-base md:text-lg">
                <span className="font-medium">Available:</span> {doctorInfo.availability}
              </p>
              <button
                onClick={() => setIsEditing({ location: false, availability: true })}
                className="bg-[#c3a4cf] text-white px-4 py-1 rounded-md cursor-pointer transition hover:bg-[#a88cb5]"
              >
                Change
              </button>

              {isEditing.availability && (
                <div ref={popoverRef} className="absolute top-12 left-0 bg-white shadow-md p-4 rounded-lg w-64 z-10">
                  <input
                    type="text"
                    placeholder="Enter new availability"
                    value={newData.availability}
                    onChange={(e) => setNewData({ ...newData, availability: e.target.value })}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button onClick={() => setIsEditing({ ...isEditing, availability: false })} className="text-gray-600">
                      Cancel
                    </button>
                    <button onClick={() => handleSave("availability")} className="bg-green-500 text-white px-3 py-1 rounded-md">
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
