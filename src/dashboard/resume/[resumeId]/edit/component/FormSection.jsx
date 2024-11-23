import React, { useState } from 'react';
import PersonalDetails from './forms/PersonalDetails';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import Summary from './forms/Summary';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableText, setEnableText] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-centers">
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid />
          Theme
        </Button>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button size="sm" onClick={() => setActiveFormIndex(activeFormIndex - 1)}>
              <ArrowLeft />
            </Button>
          )}
          <Button
            className="flex gap-2"
            disabled={!enableText}
            size="sm"
            onClick={() => setActiveFormIndex(activeFormIndex + 1)}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>
      {/* Personal Detail */}
      {activeFormIndex == 1 ? (
        <PersonalDetails enabledNext={(v) => setEnableText(v)} />
      ) : activeFormIndex == 2 ? (
        <Summary enabledNext={(v) => setEnableText(v)} />
      ) : activeFormIndex == 3 ? (
        <Experience enabledNext={(v) => setEnableText(v)} />
      ) : activeFormIndex == 4 ? (
        <Education />
      ) : activeFormIndex == 5 ? (
        <Skills />
      ) : null}

      {/* Summary */}

      {/* Experience */}

      {/* Educational Detail */}

      {/* Skills */}
    </div>
  );
}

export default FormSection;
