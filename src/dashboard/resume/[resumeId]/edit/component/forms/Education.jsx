import { LoaderCircle, University } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../../../service/GlobalApi';
import { toast } from 'sonner';

function Education() {
  const [educationalList, setEducationalList] = useState([
    {
      universityName: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  ]);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const handleChange = (index, event) => {
    const newEntries = educationalList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationalList(newEntries);
  };

  const AddNewEducation = () => {
    setEducationalList([
      ...educationalList,
      {
        universityName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };
  const RemoveEducation = () => {
    setEducationalList((educationalList) => educationalList.slice(0, -1));
  };
  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      education: educationalList,
    });
  }, [educationalList]);
  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        education: educationalList,
      },
    };
    GlobalApi.UpdateResumeDetail(params.resumeId, data).then(
      (res) => {
        console.log(res);
        setLoading(false);
        toast('Details updated!');
      },
      (error) => {
        setLoading(false);
        toast('Server Error, Plase try again.');
      }
    );
  };
  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add your educational details</p>

      <div>
        {educationalList.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2">
                <label>University Name</label>
                <Input name="universityName" onChange={(e) => handleChange(index, e)} />
              </div>
              <div>
                <label>Degree</label>
                <Input name="degree" onChange={(e) => handleChange(index, e)} />
              </div>
              <div>
                <label>Major</label>
                <Input name="major" onChange={(e) => handleChange(index, e)} />
              </div>
              <div>
                <label>Start Date</label>
                <Input type="date" name="startDate" onChange={(e) => handleChange(index, e)} />
              </div>
              <div>
                <label>End Date</label>
                <Input type="date" name="endDate" onChange={(e) => handleChange(index, e)} />
              </div>
              <div className="col-span-2">
                <label>Description</label>
                <Textarea name="description" onChange={(e) => handleChange(index, e)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" className="text-primary" onClick={AddNewEducation}>
            + Add More Education
          </Button>
          <Button variant="outline" className="text-primary" onClick={RemoveEducation}>
            - Remove
          </Button>
        </div>

        <Button disabled={loading} onClick={() => onSave()}>
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Education;
