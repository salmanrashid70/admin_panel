import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Define the types for the props
interface EditProfileDialogProps {
  name: string;
  username: string;
  onSave: (name: string, username: string) => void; // Callback function for when the form is submitted
  onClose: () => void; // Callback function for when the dialog is closed
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  name,
  username,
  onSave,
  onClose,
}) => {
  const [editedName, setEditedName] = React.useState(name);
  const [editedUsername, setEditedUsername] = React.useState(username);

  const handleSave = () => {
    onSave(editedName, editedUsername);
  };

  return (
    <Dialog onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
