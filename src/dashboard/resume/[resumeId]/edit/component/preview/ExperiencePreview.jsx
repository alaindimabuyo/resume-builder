function ExperiencePreview({ resumeInfo }) {
  const formatWorkSummary = (workSummary) => {
    if (!workSummary) return '';

    // If the content already has proper HTML formatting, return as is
    if (workSummary.includes('<ul') && workSummary.includes('<li')) {
      return workSummary;
    }

    // Handle plain text input by converting to HTML list
    const lines = workSummary.split('\n').filter((line) => line.trim());

    if (lines.length === 0) return '';

    return `<ul style="list-style-type: disc; padding-left: 1rem; margin: 0.5rem 0;">
      ${lines.map((line) => `<li style="margin: 0.25rem 0;">${line.trim()}</li>`).join('')}
    </ul>`;
  };

  return (
    <div className="my-6">
      <h2 className="text-center font-bold text-sm mb-2" style={{ color: resumeInfo?.themeColor }}>
        Professional Experience
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      {resumeInfo?.experience?.map((experience, index) => (
        <div key={index} className="my-2">
          <h2 className="text-sm font-bold" style={{ color: resumeInfo?.themeColor }}>
            {experience?.title}
          </h2>
          <h2 className="text-xs flex justify-between">
            <span>
              {experience?.companyName}
              {experience?.city && `, ${experience.city}`}
              {experience?.state && `, ${experience.state}`}
            </span>
            <span>
              {experience?.startDate} to{' '}
              {experience?.currentlyWorking ? 'Present' : experience?.endDate}
            </span>
          </h2>
          <div
            className="text-xs mt-1"
            dangerouslySetInnerHTML={{
              __html: formatWorkSummary(experience?.workSummary),
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;
