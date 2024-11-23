function SummaryPreview({ resumeInfo }) {
  return (
    <div className="my-2">
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
