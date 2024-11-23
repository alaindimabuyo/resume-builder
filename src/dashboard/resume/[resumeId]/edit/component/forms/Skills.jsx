import { Input } from '@/components/ui/input';
import React, { useContext, useState, useEffect } from 'react';
import { Rating } from '@smastrom/react-rating';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import '@smastrom/react-rating/style.css';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from '../../../../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';

function Skills() {
  const [skillsList, setSkillsList] = useState([
    {
      name: '',
      rating: 0,
    },
  ]);
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const handleChange = (index, name, value) => {
    const newEntries = skillsList.slice();
    newEntries[index][name] = value;
    setSkillsList(newEntries);
  };

  const AddNewSkills = () => {
    setSkillsList([...skillsList, { name: '', rating: 0 }]);
  };
  const RemoveSkills = () => {
    setSkillsList((skillsList) => skillsList.slice(0, -1));
  };
  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        skills: skillsList,
      },
    };
    GlobalApi.UpdateResumeDetail(resumeId, data).then(
      (res) => {
        console.log(res);
        setLoading(false);
        toast('Details Updated');
      },
      (error) => {
        setLoading(false);
        toast('Server Error, Try again!');
      }
    );
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills: skillsList,
    });
  }, [skillsList]);
  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Add your professional key skills</p>
      <div>
        {skillsList.map((item, index) => (
          <div className="flex justify-between border rounded-lg p-3 mb-2">
            <div>
              <label className="text-xs">Name</label>
              <Input
                className="w-full"
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <Rating
              style={{ maxWidth: 120 }}
              value={item.rating}
              onChange={(v) => handleChange(index, 'rating', v)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" className="text-primary" onClick={AddNewSkills}>
            + Add More Skills
          </Button>
          <Button variant="outline" className="text-primary" onClick={RemoveSkills}>
            - Remove
          </Button>
        </div>

        <Button type="submit" disabled={loading} onClick={() => onSave()}>
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
