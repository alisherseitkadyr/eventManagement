import React, { useEffect, useState, useRef } from "react";
import { fetchTemplateById } from "../../shared/api/templates";
import type { TemplateFull } from "../../entities/template/model/types";
import { PhonePreview } from "../../features/phone-view"; // Your existing phone frame component

interface TemplatePreviewModalProps {
  templateId: string;
  onClose: () => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  templateId,
  onClose,
}) => {
  const [template, setTemplate] = useState<TemplateFull | null>(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchTemplateById(templateId)
      .then((data) => setTemplate(data))
      .catch(() => setTemplate(null))
      .finally(() => setLoading(false));
  }, [templateId]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Close when clicking outside the modal content
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl">Loading...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl">Template not found</div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{template.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            ✕
          </button>
        </div>

        {/* Content – two‑column layout with phone preview on left */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Phone preview */}
            <div className="flex-1 flex justify-center">
              <PhonePreview template={template} />
            </div>

            {/* Right: Details and actions */}
            <div className="w-full lg:w-64 space-y-4">
              <p className="text-gray-600">{template.category}</p>
              <button
                onClick={() => {
                  // Navigate to editor – this can be a route change now
                  window.location.href = `/editor/${template.id}`;
                }}
                className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
              >
                Customize
              </button>
              <button
                onClick={onClose}
                className="w-full border py-3 rounded-xl hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};