import { Loader2, PlusSquare, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function AddResume() {
  const [open, setOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigation = useNavigate();

  const onCreate = async (e) => {
    e.preventDefault();
    if (!resumeTitle.trim()) return;

    setLoading(true);
    const uuid = uuidv4();

    const data = {
      data: {
        title: resumeTitle,
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
      },
    };

    try {
      const res = await GlobalApi.CreateNewResume(data);
      console.log(res.data.data.documentId);
      setResumeTitle('');
      setIsSuccess(true);
      // Reset success message after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
      navigation('/dashboard/resume/' + res.data.data.documentId + '/edit');
    } catch (err) {
      console.log('Error creating resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResumeTitle('');
    setIsSuccess(false);
    setOpen(false);
  };

  return (
    <>
      <div
        className="p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed"
        onClick={() => setOpen(true)}
      >
        <PlusSquare />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={onCreate}>
            <DialogHeader>
              <DialogTitle>Create New Resume</DialogTitle>
              <DialogDescription>
                <p>Add a title for your new resume</p>
                <Input
                  className="my-2"
                  placeholder="Ex. Full Stack Developer"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  required
                />
                {isSuccess && (
                  <div className="flex items-center gap-2 text-green-600 mt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Resume created successfully!</span>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-4 mt-4">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!resumeTitle.trim() || loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;
