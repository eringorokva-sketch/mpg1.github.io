import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiSave, FiPrinter, FiUpload, FiPlus, FiTrash } from 'react-icons/fi';

const doctors = [
  'ნინო კიკვაძე',
  'ანა დალაქიშვილი',
  'თეკლა მაისურაძე',
  'მურად მიგინეიშვილი',
  'ქეთევან ზედელაშვილი',
  'ტერეზა ოსადჩუკე',
  'კატერინე მიქელაძე',
];

const App = () => {
  const [logo, setLogo] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [historyNumber, setHistoryNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [signatures, setSignatures] = useState({});
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [appendMode, setAppendMode] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem('logo');
    if (savedLogo) setLogo(savedLogo);

    const savedSignatures = JSON.parse(localStorage.getItem('signatures') || '{}');
    setSignatures(savedSignatures);

    const savedTemplates = JSON.parse(localStorage.getItem('templates') || '[]');
    setTemplates(savedTemplates);
  }, []);

  useEffect(() => {
    if (logo) localStorage.setItem('logo', logo);
  }, [logo]);

  useEffect(() => {
    localStorage.setItem('signatures', JSON.stringify(signatures));
  }, [signatures]);

  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    if (!selectedDoctor) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatures((prev) => ({ ...prev, [selectedDoctor]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveTemplate = () => {
    if (!templateName || !content) return;
    const newTemplate = { name: templateName, content };
    setTemplates((prev) => [...prev, newTemplate]);
    setTemplateName('');
  };

  const loadTemplate = () => {
    if (!selectedTemplate) return;
    const template = templates.find((t) => t.name === selectedTemplate);
    if (template) {
      setContent(appendMode ? content + template.content : template.content);
    }
  };

  const deleteTemplate = (name) => {
    setTemplates((prev) => prev.filter((t) => t.name !== name));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for Templates */}
      <div className="w-1/4 bg-white p-4 border-r border-gray-200 no-print">
        <h2 className="text-lg font-bold mb-4">შაბლონები</h2>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="შაბლონის სახელი"
          className="w-full p-2 border mb-2"
        />
        <button
          onClick={saveTemplate}
          className="flex items-center bg-primary text-white p-2 rounded mb-4"
        >
          <FiSave className="mr-2" /> შენახვა
        </button>
        <select
          value={selectedTemplate || ''}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="w-full p-2 border mb-2"
        >
          <option value="">აირჩიეთ შაბლონი</option>
          {templates.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={appendMode}
            onChange={(e) => setAppendMode(e.target.checked)}
          />
          <span className="ml-2">დამატება არსებულ ტექსტს</span>
        </label>
        <button
          onClick={loadTemplate}
          className="flex items-center bg-secondary text-white p-2 rounded mb-4"
        >
          <FiPlus className="mr-2" /> ჩასმა
        </button>
        <ul>
          {templates.map((t) => (
            <li key={t.name} className="flex justify-between mb-2">
              {t.name}
              <button onClick={() => deleteTemplate(t.name)}>
                <FiTrash className="text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Form */}
      <div className="w-3/4 p-8 print-container">
        <div className="bg-white p-8 rounded shadow-md">
          {/* Header */}
          <div className="text-center mb-8">
            {logo ? (
              <img src={logo} alt="ლოგო" className="mx-auto h-20" />
            ) : (
              <label className="cursor-pointer no-print">
                <FiUpload className="mx-auto text-4xl text-gray-500" />
                <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
              </label>
            )}
            <h1 className="text-xl font-bold">
              თბილისის სახელმწიფო სამედიცინო უნივერსიტეტისა და ინგოროყვას მაღალი სამედიცინო ტექნოლოგიების საუნივერსიტეტო კლინიკა
            </h1>
          </div>

          {/* Patient Data */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label>პაციენტის სახელი და გვარი</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full p-2 border"
              />
            </div>
            <div>
              <label>ისტორიის ნომერი</label>
              <input
                type="text"
                value={historyNumber}
                onChange={(e) => setHistoryNumber(e.target.value)}
                className="w-full p-2 border"
              />
            </div>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label>თარიღი</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border"
            />
          </div>

          {/* Prescription Content */}
          <div className="mb-4">
            <label>დანიშნულება</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link'],
                  [{ align: [] }],
                ],
              }}
            />
          </div>

          {/* Doctor Data */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label>ექიმის სახელი და გვარი</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full p-2 border"
              >
                <option value="">აირჩიეთ ექიმი</option>
                {doctors.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>ხელმოწერა</label>
              {selectedDoctor && signatures[selectedDoctor] ? (
                <img
                  src={signatures[selectedDoctor]}
                  alt="ხელმოწერა"
                  className="h-20"
                />
              ) : (
                selectedDoctor && (
                  <label className="cursor-pointer no-print">
                    <FiUpload className="text-4xl text-gray-500" />
                    <input
                      type="file"
                      onChange={handleSignatureUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                )
              )}
            </div>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center bg-primary text-white p-2 rounded no-print"
          >
            <FiPrinter className="mr-2" /> ბეჭდვა
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
