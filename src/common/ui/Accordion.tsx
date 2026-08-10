import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
    header: ReactNode;
    children: ReactNode;
    actions?: ReactNode;
    defaultOpen?: boolean;
}

export function AccordionItem({ header, children, actions, defaultOpen = false }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-whiteColor">
            <div className="flex items-center gap-2 hover:bg-bgSecondary transition-colors">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex items-center gap-3 flex-1 min-w-0 px-4 py-3 text-left cursor-pointer"
                >
                    <ChevronDown
                        size={16}
                        className={`shrink-0 text-textSecondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                    <div className="flex-1 min-w-0">{header}</div>
                </button>
                {actions && (
                    <div className="pr-4" onClick={(e) => e.stopPropagation()}>
                        {actions}
                    </div>
                )}
            </div>
            {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-borderLight bg-bgSecondary/40">
                    {children}
                </div>
            )}
        </div>
    );
}

interface AccordionProps {
    children: ReactNode;
}

export function Accordion({ children }: AccordionProps) {
    return (
        <div className="rounded-md border border-borderLight divide-y divide-borderLight overflow-hidden">
            {children}
        </div>
    );
}
