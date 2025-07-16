import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface AdminNotificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function AdminNotification({ open, onOpenChange }: AdminNotificationProps) {
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="pr-0 gap-0 bg-white"
          style={{ width: "30vw", maxWidth: "800px" }}
        >
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>No new Notifictaions...</SheetDescription>
          </SheetHeader>

          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AdminNotification;
