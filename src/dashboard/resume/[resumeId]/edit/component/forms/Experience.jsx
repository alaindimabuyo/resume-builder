import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import RichTextEditor from '@/dashboard/components/RichTextEditor';
import { useContext, useEffect, useState } from 'react';
import GlobalApi from '../../../../../../../service/GlobalApi';
import { LoaderCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

const createFormField = () => ({
  title: '',
  companyName: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  workSummary: '',
});

function Experience() {
  const [experienceList, setExperienceList] = useState([createFormField()]);

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const handleChange = (index, event) => {
    const newEntries = experienceList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };
  const params = useParams();

  const AddNewExperience = () => {
    setExperienceList([...experienceList, createFormField()]);
  };

  const RemoveExperience = () => {
    setExperienceList((experienceList) => experienceList.slice(0, -1));
  };

  const handleRichTextEditor = (e, name, index) => {
    const newEntries = experienceList.slice();
    newEntries[index][name] = e.target.value;
    setExperienceList(newEntries);
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      experience: experienceList,
    });
  }, [experienceList]);

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        experience: experienceList.map(({ id, ...rest }) => rest),
      },
    };

    console.log(experienceList);

    GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(
      (res) => {
        console.log(res);
        setLoading(false);
        toast('Details updated !');
      },
      (error) => {
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Professional Experience</h2>
        <p>Add your previous Job Experience</p>
        <div>
          {experienceList.map((field, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div>
                  <label>Position Title</label>
                  <Input name="title" onChange={(event) => handleChange(index, event)} />
                </div>
                <div>
                  <label>Company Name</label>
                  <Input name="companyName" onChange={(event) => handleChange(index, event)} />
                </div>
                <div>
                  <label>City</label>
                  <Input name="city" onChange={(event) => handleChange(index, event)} />
                </div>
                <div>
                  <label>State</label>
                  <Input name="state" onChange={(event) => handleChange(index, event)} />
                </div>
                <div>
                  <label>Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(event) => handleChange(index, event)}
                  />
                </div>
                <div>
                  <label>End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    onChange={(event) => handleChange(index, event)}
                  />
                </div>
                <div className="col-span-2">
                  <RichTextEditor
                    index={index}
                    onRichEditorChange={(event) =>
                      handleRichTextEditor(event, 'workSummary', index)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" className="text-primary" onClick={AddNewExperience}>
              + Add More Experience
            </Button>
            <Button variant="outline" className="text-primary" onClick={RemoveExperience}>
              - Remove
            </Button>
          </div>

          <Button type="submit" disabled={loading} onClick={() => onSave()}>
            {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;
