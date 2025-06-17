// Reusable DetailItem component
export const DetailItem = ({ label, value, icon, isLink }) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2">
      {icon && <span className="mt-0.5">{icon}</span>}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            className="font-medium text-blue-600 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="font-medium">{value}</p>
        )}
      </div>
    </div>
  );
};

// Specialized component for links
export const DetailItemWithLink = ({ label, value }) => {
  if (!value) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-1">
        {label}
      </h4>
      <a
        href={value}
        target="_blank"
        className="text-blue-600 hover:underline truncate block"
      >
        {value}
      </a>
    </div>
  );
};
