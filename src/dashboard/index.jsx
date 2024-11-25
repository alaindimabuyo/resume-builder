import React, { useEffect, useState } from 'react';
import AddResume from './components/AddResume';
import { useUser } from '@clerk/clerk-react';
import GlobalApi from './../../service/GlobalApi';
import ResumeItem from './components/ResumeItem';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    user && GetResumeList();
  }, [user]);
  const GetResumeList = () => {
    GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress).then((res) => {
      setResumeList(res.data.data);
    });
  };
  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h1 className="font-bold text-3xl">My Resume</h1>
      <p>Start Creating AI resume to your next Job role</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid py-5 gap-5">
        <AddResume />
        {resumeList.length > 0 &&
          resumeList.map((resume, index) => (
            <ResumeItem resume={resume} key={index} refreshData={GetResumeList} />
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
