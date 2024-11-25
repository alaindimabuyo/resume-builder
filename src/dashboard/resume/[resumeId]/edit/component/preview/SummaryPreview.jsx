function SummaryPreview({ resumeInfo }) {
  return (
    <div className="my-6">
      <div
        className="text-xs mt-3 space-y-2"
        dangerouslySetInnerHTML={{
          __html: resumeInfo?.summary || '',
        }}
      />
    </div>
  );
}
export default SummaryPreview;
