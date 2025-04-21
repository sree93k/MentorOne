"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
import DummyImage from "@/assets/DummyProfile.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
}: PaymentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Confirm Payment
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center mb-1">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            {/* <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
            <img src={DummyImage} alt="profile image" className="w-auto h-10" />
          </div>
          <div>
            <h1 className="text-sm">Anita Benny</h1>
            <h2 className="text-xl font-bold">Mock Interview</h2>
          </div>
        </div>

        <div className="flex text-sm gap-2">
          <span>60 Minutes Meeting</span>
          <span>|</span>
          <span>At 10:00 AM</span>
          <span>|</span>
          <span>10 March 2025</span>
        </div>

        <form className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              className="bg-white border-white text-white"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="bg-white border-white text-white"
              placeholder="Enter your email"
            />
          </div>

          <div className="">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              className="bg-white border-white text-white"
              placeholder="Enter your phone number"
            />
          </div>

          {/* <div>
            <Label htmlFor="cv">Upload CV</Label>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                className="text-black bg-gray-200 hover:bg-gray-300"
              >
                Browse
              </Button>
              <span className="text-sm">Sreekuttan_CV.pdf</span>
            </div>
          </div> */}

          <div className=" bg-white text-black rounded-lg p-4 ">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Mock Interview</span>
                <span>₹ 2000</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Charge</span>
                <span>₹ 300</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹ 2300</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify between  gap-6 px-10">
            <Button
              variant="outline"
              className="flex-1 rounded-full border-gray-400 flex items-center justify-center gap-2"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1 rounded-full bg-white text-black"
              onClick={onConfirm}
            >
              Confirm And Pay
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
