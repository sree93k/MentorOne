// import { Star } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface Booking {
//   id: string;
//   mentorName: string;
//   mentorImage: string;
//   title: string;
//   technology: string;
//   date: string;
//   time: string;
//   price: number;
//   rating?: number;
//   feedback?: string;
// }

// interface BookingCardProps {
//   booking: Booking;
//   type: "upcoming" | "completed";
//   onFeedbackClick?: () => void;
// }

// export default function BookingCard({
//   booking,
//   type,
//   onFeedbackClick,
// }: BookingCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-[250px]">
//       <div className="bg-red-500 p-4">
//         <div className="flex items-center gap-4">
//           <img
//             src={booking.mentorImage}
//             alt={booking.mentorName}
//             className="w-12 h-12 rounded-full object-cover"
//           />
//           <div>
//             <h3 className="text-white font-semibold">{booking.mentorName}</h3>
//             <Button
//               variant="outline"
//               size="sm"
//               className="mt-1 bg-white hover:bg-gray-100 rounded-full"
//             >
//               Profile
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="p-4">
//         <h4 className="font-semibold text-lg">{booking.title}</h4>
//         <p className="text-gray-600">{booking.technology}</p>

//         <div className="flex flex-col justify- mt-3">
//           <div className="flex justify-between gap-4 ">
//             <p className="text-sm text-gray-600">{booking.date}</p>
//             <p className="text-sm text-gray-600">{booking.time}</p>
//           </div>
//           <p className="font-semibold py-2">₹{booking.price}/-</p>
//         </div>

//         {type === "upcoming" ? (
//           <div className="mt-4">
//             <span className="px-5 py-2  bg-green-500 text-white rounded-full text-sm ">
//               Booked
//             </span>
//           </div>
//         ) : (
//           <div className="mt-4 flex justify-between items-center">
//             {booking.rating ? (
//               <div className="flex items-center gap-1">
//                 <span className="font-semibold ">{booking.rating}</span>
//                 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//               </div>
//             ) : null}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onFeedbackClick}
//               className="bg-orange-500 text-white hover:bg-orange-600 rounded-full "
//             >
//               Feedback
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  mentorName: string;
  mentorImage: string;
  mentorId: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  price: number;
  status: string;
  rating?: number;
  feedback?: string;
}

interface BookingCardProps {
  booking: Booking;
  type: "upcoming" | "completed";
  navigateToProfile?: () => void;
  onFeedbackClick?: () => void;
}

export default function BookingCard({
  booking,
  type,
  navigateToProfile,
  onFeedbackClick,
}: BookingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-[250px]">
      <div className="bg-red-500 p-4">
        <div className="flex items-center gap-4">
          <img
            src={booking.mentorImage}
            alt={booking.mentorName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-white font-semibold">{booking.mentorName}</h3>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 bg-white hover:bg-gray-100 rounded-full"
              onClick={navigateToProfile}
            >
              Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-lg">{booking.title}</h4>
        <p className="text-gray-600">{booking.technology}</p>

        <div className="flex flex-col justify- mt-3">
          <div className="flex justify-between gap-4 ">
            <p className="text-sm text-gray-600">{booking.date}</p>
            <p className="text-sm text-gray-600">{booking.time}</p>
          </div>
          <p className="font-semibold py-2">₹{booking.price}/-</p>
        </div>

        {type === "upcoming" ? (
          <div className="mt-4">
            <span className="px-5 py-2 bg-green-500 text-white rounded-full text-sm">
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        ) : (
          <div className="mt-4 flex justify-between items-center">
            {booking.rating ? (
              <div className="flex items-center gap-1">
                <span className="font-semibold">{booking.rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            ) : null}
            {!booking.feedback && (
              <Button
                variant="outline"
                size="sm"
                onClick={onFeedbackClick}
                className="bg-orange-500 text-white hover:bg-orange-600 rounded-full"
              >
                Feedback
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
