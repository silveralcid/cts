import { useMemo, useState, useEffect } from "react";
import { Modal, ScrollArea, Loader, Center, Text } from "@mantine/core";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export function FileViewerModal({
  opened,
  onClose,
  fileUrl,
  filename,
  mimeType,
}) {
  const [textContent, setTextContent] = useState("");
  const [numPages, setNumPages] = useState(1);
  const ext = useMemo(
    () => filename.split(".").pop()?.toLowerCase(),
    [filename]
  );

  // Load text/markdown only once per fileUrl
  useEffect(() => {
    if (!opened) return;
    if (ext === "txt" || ext === "md") {
      fetch(fileUrl)
        .then((res) => res.text())
        .then(setTextContent)
        .catch(() => setTextContent("Failed to load file"));
    }
  }, [opened, fileUrl, ext]);

  const isPDF = mimeType?.includes("pdf") || ext === "pdf";
  const isMarkdown = ext === "md";
  const isText = ext === "txt";

  const useNativePDF = true;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="90%"
      title={filename}
      centered
    >
      {isPDF &&
        (useNativePDF ? (
          <iframe
            src={fileUrl}
            title={filename}
            style={{ width: "100%", height: "80vh", border: "none" }}
          />
        ) : (
          <ScrollArea h="80vh">
            <Center>
              <Document file={fileUrl}>
                {Array.from({ length: numPages }, (_, i) => (
                  <Page key={i} pageNumber={i + 1} width={800} />
                ))}
              </Document>
            </Center>
          </ScrollArea>
        ))}

      {isMarkdown && (
        <ScrollArea h="80vh" p="md">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {textContent}
          </ReactMarkdown>
        </ScrollArea>
      )}

      {isText && (
        <ScrollArea h="80vh" p="md">
          <Text style={{ whiteSpace: "pre-wrap" }}>{textContent}</Text>
        </ScrollArea>
      )}

      {!isPDF && !isMarkdown && !isText && (
        <Text c="dimmed">Unsupported file type</Text>
      )}
    </Modal>
  );
}
