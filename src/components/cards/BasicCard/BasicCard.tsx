import React from "react";
import "./BasicCard.css";

interface BasicCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onClick?: () => void;
}

const BasicCard: React.FC<BasicCardProps> = ({
  title,
  description,
  imageUrl,
  onClick,
}) => {
  return (
    <div className="basic-card" onClick={onClick}>
      {imageUrl && (
        <img src={imageUrl} alt={title} className="basic-card-image" />
      )}
      <div className="basic-card-content">
        <h3 className="basic-card-title">{title}</h3>
        <p className="basic-card-description">{description}</p>
      </div>
    </div>
  );
};

export default BasicCard;
