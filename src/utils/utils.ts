import type { ChipVariant } from "../common/ui/Chip";

const ACRONYMS = new Set([
    "HOD",
    "IB",
    "ICSE",
    "CBSE",
    "MBA",
    "BE",
    "ME",
    "MSC",
    "MTECH",
    "BTECH",
    "MCQ",
    "MSQ",
]);

const formatWord = (word: string): string => {
    if (ACRONYMS.has(word.toUpperCase())) return word.toUpperCase();
    if (word === word.toUpperCase()) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    if (word === word.toLowerCase()) return word.charAt(0).toUpperCase() + word.slice(1);
    return word;
};

// Converts an enum value like "ASSISTANT_PROFESSOR" or "on_leave" into "Assistant Professor",
// while leaving already human-readable values (e.g. "PhD", "10th") and known acronyms (e.g. "MBA") untouched.
export const formatEnumLabel = (value: string): string => {
    return value.split("_").map(formatWord).join(" ");
};

export const toEnumOptions = <T extends Record<string, string>>(enumObj: T) => {
    return Object.values(enumObj).map((value) => ({ value, label: formatEnumLabel(value) }));
};

// Semantic chip colors for known enum values (status/mode/type/designation) used across table columns.
// Anything not listed here falls back to "gray" so new enum values still render sensibly.
const CHIP_VARIANTS: Record<string, ChipVariant> = {
    // Statuses (student / faculty / exam / room / attempt)
    ACTIVE: "green",
    INACTIVE: "gray",
    ALUMNI: "blue",
    DROPOUT: "red",
    SUSPENDED: "red",
    ON_LEAVE: "yellow",
    TERMINATED: "red",
    RETIRED: "purple",
    PENDING: "yellow",
    DRAFT: "gray",
    PUBLISHED: "blue",
    ONGOING: "yellow",
    COMPLETED: "green",
    RESULTS_PUBLISHED: "purple",
    SCHEDULED: "blue",
    CLOSED: "gray",
    WAITING: "yellow",
    ADMITTED: "green",
    REJECTED: "red",
    REMOVED: "red",
    NOT_STARTED: "gray",
    IN_PROGRESS: "yellow",
    SUBMITTED: "blue",

    // Exam mode
    AUTO: "blue",
    PROCTORING: "purple",

    // Employment type
    PERMANENT: "green",
    CONTRACT: "blue",
    VISITING: "yellow",
    GUEST: "gray",
    ADJUNCT: "indigo",

    // Faculty designation
    PROFESSOR: "purple",
    ASSOCIATE_PROFESSOR: "indigo",
    ASSISTANT_PROFESSOR: "blue",
    LECTURER: "gray",
    HOD: "orange",
    PRINCIPAL: "red",

    // Subject / question type
    THEORY: "blue",
    PRACTICAL: "green",
    ELECTIVE: "purple",
    MCQ: "blue",
    MSQ: "indigo",
    WRITTEN: "gray",
};

export const getChipVariant = (value: string): ChipVariant => {
    return CHIP_VARIANTS[value.toUpperCase()] || "gray";
};
