import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Braces, Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState, useEffect } from 'react';
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  HtmlButton,
  Separator,
  Toolbar,
  Editor,
  EditorProvider,
} from 'react-simple-wysiwyg';
import { toast } from 'sonner';
import { AIChatSession } from '../../../service/AIModal';

const PROMPT =
  'position title: {positionTitle}, Depends on position title give me 5-7 bullet points for my experience in resume. Return only bullet points without any additional text or formatting.';

function RichTextEditor({ onRichEditorChange, index, defaultValue }) {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Set initial value and update when defaultValue changes
  useEffect(() => {
    // First try to get value from resumeInfo
    const savedValue = resumeInfo?.experience?.[index]?.workSummary;
    if (savedValue) {
      setValue(savedValue);
    } else if (defaultValue) {
      // Fallback to defaultValue if no saved value exists
      setValue(defaultValue);
    }
  }, [defaultValue, resumeInfo?.experience, index]);

  const formatAIResponse = (text) => {
    const lines = text
      .replace(/{|}|\[|\]/g, '')
      .split('\n')
      .filter((line) => line.trim());

    return `<ul style="list-style-type: disc; padding-left: 1rem; margin: 0.5rem 0;">
      ${lines.map((line) => `<li style="margin: 0.25rem 0;">${line.trim()}</li>`).join('')}
    </ul>`;
  };

  const GenerateSummaryFromAI = async () => {
    setLoading(true);
    if (!resumeInfo?.experience?.[index]?.title) {
      toast('Please Add Position Title');
      setLoading(false);
      return;
    }

    try {
      const prompt = PROMPT.replace('{positionTitle}', resumeInfo.experience[index].title);
      const result = await AIChatSession.sendMessage(prompt);
      const response = await result.response.text();
      const formattedResponse = formatAIResponse(response);
      setValue(formattedResponse);
      onRichEditorChange({ target: { value: formattedResponse } });
    } catch (error) {
      toast('Error generating summary');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          className="flex gap-2 border-primary text-primary"
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichEditorChange(e);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnBulletList />
            <BtnNumberedList />
            <Separator />
            <BtnLink />
            <BtnClearFormatting />
            <Separator />
            <BtnStyles />
            <BtnUndo />
            <BtnRedo />
            <HtmlButton />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;
