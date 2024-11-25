import Header from '@/components/custom/Header';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import ResumePreview from '@/dashboard/resume/[resumeId]/edit/component/ResumePreview';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../service/GlobalApi';
import { RWebShare } from 'react-web-share';

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState();
  const { resumeId } = useParams();

  useEffect(() => {
    GetResumeInfo();
  }, []);

  const GetResumeInfo = () => {
    GlobalApi.GetResumeById(resumeId).then((res) => {
      console.log(res.data.data);
      setResumeInfo(res.data.data);
    });
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />
        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className=" text-center text-2xl font-medium">
            Congrats! Your Ultimate AI generated resume is ready!
            <p className="text-center text-gray-400">
              Now you are ready to download your resume and you can share unique url with you
              friends and family.
            </p>
          </h2>
          <div className="flex justify-between px-44 my-10">
            <Button onClick={handleDownload}>Download</Button>
            <RWebShare
              data={{
                text: 'Hello Everyone, This is my resume please open url to for preview.',
                url: import.meta.env.VITE_BASE_URL + 'my/resume/' + resumeId + '/view',
                title: resumeInfo?.firstName + ' ' + resumeInfo?.lastName + 'resume',
              }}
              onClick={() => console.log('shared successfully!')}
            >
              <Button>Share</Button>
            </RWebShare>
          </div>
        </div>
      </div>

      <div id="print-area" className="my-10 mx-10 md:mx-20 lg:mx-36">
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
