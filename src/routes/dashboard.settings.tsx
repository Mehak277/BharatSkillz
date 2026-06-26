import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getFirebaseAuth, getFirebaseFirestore } from "@/lib/firebase/config";
import { deleteUser, updatePassword } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [password, setPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  


  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !password) return;
    try {
      setUpdatingPassword(true);
      const auth = await getFirebaseAuth();
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, password);
        toast.success("Password updated successfully");
        setPassword("");
      }
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error("Please log out and log back in to update password.");
      } else {
        toast.error(error.message || "Failed to update password");
      }
    } finally {
      setUpdatingPassword(false);
    }
  };


  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      setIsDeleting(true);
      const auth = await getFirebaseAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) throw new Error("No authenticated user found.");

      const db = getFirebaseFirestore();
      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(currentUser);
      
      toast.success("Account deleted successfully.");
      setShowConfirm(false);
      navigate({ to: "/" });
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error("Please log out and log back in to delete your account.");
      } else {
        toast.error(error.message || "Failed to delete account.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account settings.</p>
      </div>

      <section className="glass-card rounded-3xl p-6">
        <h3 className="text-base font-semibold">Change Password</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Update your account password.
        </p>
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
          <div>
            <label htmlFor="password" className="text-sm font-medium">New Password</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={updatingPassword || !password}>
            {updatingPassword ? "Updating..." : "Update password"}
          </Button>
        </form>
      </section>



      <section className="glass-card rounded-3xl border-rose-500/30 p-6">
        <h3 className="text-base font-semibold text-rose-600">Danger zone</h3>
        <p className="text-xs text-muted-foreground">
          Permanently delete your account and all related data.
        </p>
        <Button 
          variant="destructive" 
          className="mt-4" 
          onClick={() => setShowConfirm(true)}
        >
          Delete account
        </Button>
      </section>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex sm:justify-end gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isDeleting}>
              No
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Yes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
