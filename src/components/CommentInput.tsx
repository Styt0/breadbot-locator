
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CommentInputProps {
  onCommentSubmit: (comment: string) => void;
  initialComment?: string;
  className?: string;
  placeholder?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  onCommentSubmit,
  initialComment = "",
  className,
  placeholder = "Voeg een opmerking toe (optioneel)..."
}) => {
  const [comment, setComment] = useState(initialComment);
  const [isExpanded, setIsExpanded] = useState(!!initialComment);

  const handleSubmit = () => {
    if (comment.trim()) {
      onCommentSubmit(comment.trim());
    }
    if (!comment.trim()) {
      setIsExpanded(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {isExpanded ? (
        <>
          <Textarea
            placeholder={placeholder}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none focus-visible:ring-bread-500"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setComment("");
                setIsExpanded(false);
              }}
            >
              Annuleren
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
            >
              Opslaan
            </Button>
          </div>
        </>
      ) : (
        <button
          type="button"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setIsExpanded(true)}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          <span>Voeg een opmerking toe</span>
        </button>
      )}
    </div>
  );
};

export default CommentInput;
