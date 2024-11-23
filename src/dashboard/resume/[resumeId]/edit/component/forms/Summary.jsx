import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import GlobalApi from '../../../../../../../service/GlobalApi';
import { AIChatSession } from '../../../../../../../service/AIModal';

const PROMPT = `job title: {jobTitle}
Please generate a resume summary in the following JSON format:
{
  "suggestions": [
    {
      "experienceLevel": "Fresher",
      "summary": "..."
    },
    {
      "experienceLevel": "Mid-Level",
      "summary": "..."
    },
    {
      "experienceLevel": "Experienced",
      "summary": "..."
    }
  ]
}
Each summary should be 4-5 lines long and tailored to the job title. Format the summary with proper paragraph spacing`;

function Summary({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState(resumeInfo?.summary || '');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const params = useParams();
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState([]);

  useEffect(() => {
    if (summary) {
      setResumeInfo((prev) => ({
        ...prev,
        summary: summary,
      }));
    }
  }, [summary, setResumeInfo]);

  const formatSummary = (text) => {
    // Split the text by periods and wrap each sentence in a paragraph
    const sentences = text.split('.').filter((sentence) => sentence.trim());
    return sentences.map((sentence) => `${sentence.trim()}`).join('');
  };

  const GenerateSummaryFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast.error('Please add a job title first');
      return;
    }

    try {
      setGenerating(true);
      const promptWithTitle = PROMPT.replace('{jobTitle}', resumeInfo.jobTitle);
      const result = await AIChatSession.sendMessage(promptWithTitle);
      const responseText = result.response.text();

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (error) {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response');
        }
      }

      const suggestions = parsedResponse.suggestions || [parsedResponse];
      setAiGeneratedSummaryList(suggestions);
      toast.success('Generated suggestions successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!summary.trim()) {
      toast.error('Please add a summary');
      return;
    }

    try {
      setLoading(true);
      const formattedSummary = formatSummary(summary);
      const data = {
        data: {
          summary: formattedSummary,
        },
      };

      await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
      setResumeInfo((prev) => ({
        ...prev,
        summary: formattedSummary,
      }));
      enabledNext(true);
      toast.success('Summary updated successfully');
    } catch (error) {
      console.error('Error saving summary:', error);
      toast.error('Failed to save summary');
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestionText) => {
    const formattedSummary = formatSummary(suggestionText);
    setSummary(suggestionText);
    setResumeInfo((prev) => ({
      ...prev,
      summary: formattedSummary,
    }));
    toast.success('Summary applied');
  };

  return (
    <div className="space-y-6">
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4">
        <h2 className="font-bold text-lg">Summary</h2>
        <p className="text-gray-600">Add a professional summary for your resume</p>

        <form className="mt-7 space-y-4" onSubmit={onSave}>
          <div className="flex justify-between items-center">
            <label className="font-medium">Professional Summary</label>
            <Button
              size="sm"
              variant="outline"
              type="button"
              className="border-primary text-primary"
              onClick={GenerateSummaryFromAI}
              disabled={generating}
            >
              {generating ? (
                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              Generate from AI
            </Button>
          </div>

          <Textarea
            className="min-h-[120px]"
            value={summary}
            placeholder="Enter your professional summary here..."
            onChange={(e) => setSummary(e.target.value)}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummaryList.length > 0 && (
        <div className="p-5 shadow-lg rounded-lg">
          <h2 className="font-bold text-lg mb-4">AI Generated Suggestions</h2>
          <div className="space-y-4">
            {aiGeneratedSummaryList.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-primary">{item.experienceLevel} Level</h3>
                  <Button size="sm" variant="outline" onClick={() => applySuggestion(item.summary)}>
                    Use This
                  </Button>
                </div>
                <p className="text-gray-700">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default Summary;
