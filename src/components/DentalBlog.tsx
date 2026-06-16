import { useState } from "react";
import { BLOG_MOCK } from "../data";
import { Search, BookOpen, Clock, Calendar, ArrowRight, X, ArrowLeft } from "lucide-react";
import { BlogPost } from "../types";

export default function DentalBlog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todo");
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  const filteredPosts = BLOG_MOCK.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === "todo") return matchesSearch;
    return p.category.toLowerCase() === selectedCategory.toLowerCase() && matchesSearch;
  });

  return (
    <div className="py-12 bg-slate-50/50 font-sans" id="blog-dental-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toggle Reading Drawer view */}
        {readingPost ? (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm animate-fade-in" id="blog-full-reader-body">
            
            <button
              onClick={() => setReadingPost(null)}
              className="mb-8 font-bold text-xs text-sky-600 hover:text-sky-700 flex items-center bg-sky-50 px-3.5 py-2 rounded-xl border border-sky-100/50 w-fit cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Consejos Dentales
            </button>

            <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md uppercase">
              {readingPost.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-4领先none">
              {readingPost.title}
            </h1>

            <div className="mt-4 flex items-center space-x-4 text-xs font-semibold text-slate-400 pb-6 border-b border-slate-100">
              <span>Por {readingPost.author}</span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {readingPost.date}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {readingPost.readTime}
              </span>
            </div>

            {/* Content Display body with generous spacing and beautiful typography */}
            <div className="mt-8 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium space-y-5">
              {readingPost.image && (
                <div className="overflow-hidden rounded-2xl max-h-[300px] mb-6 shadow-sm border">
                  <img src={readingPost.image} alt={readingPost.title} className="w-full h-full object-cover" />
                </div>
              )}
              {readingPost.content.split("\n\n").map((para, pi) => (
                <p key={pi}>
                  {para.split("\n").map((line, li) => {
                    // Render list style formatting representation if lines starts on numbers
                    if (/^\d+\..*/.test(line)) {
                      return (
                        <span key={li} className="block pl-4 py-1 italic text-slate-700 font-bold">
                          {line}
                        </span>
                      );
                    }
                    return (
                      <span key={li} className="block">
                        {line.split("**").map((chunk, ci) => {
                          if (ci % 2 === 1) {
                            return <strong key={ci} className="font-bold text-[#0077B6]">{chunk}</strong>;
                          }
                          return chunk;
                        })}
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-slate-100 text-center">
              <a
                href="https://wa.me/51970165171"
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-md cursor-pointer"
              >
                ¿Quieres resolver dudas con el especialista? Escríbenos hoy
              </a>
            </div>
          </div>
        ) : (
          /* Normal blog list grid */
          <div>
            {/* Title */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3.5 py-1 rounded-full uppercase tracking-widest inline-block">
                📚 Guías y Consejos Dentales Profesionales
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
                Blog de Educación Dental
              </h1>
              <p className="mt-3 text-sm text-slate-500">
                La prevención salva dientes. Lee nuestros consejos cortos escritos por nuestros cirujanos odontólogos sobre higiene habitual y salud preventiva.
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm max-w-4xl mx-auto mb-10">
              {/* Search input */}
              <div className="relative flex-1 max-w-sm w-full">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar consejos dentales..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl pl-9 pr-4 py-2 text-xs outline-none text-slate-700"
                />
              </div>

              {/* Badges categories filter */}
              <div className="flex space-x-1.5 flex-wrap">
                {[
                  { id: "todo", label: "Todos" },
                  { id: "ortodoncia", label: "Ortodoncia" },
                  { id: "odontopediatría", label: "Odontopediatría" },
                  { id: "general", label: "Profilaxis / Salud Bucal" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedCategory === c.id
                        ? "bg-sky-600 text-white shadow-sm"
                        : "bg-slate-50 text-slate-600 hover:text-sky-600 hover:bg-sky-50"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid display list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5 max-w-6xl mx-auto">
              {filteredPosts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 p-5.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image */}
                    {p.image && (
                      <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-50 relative mb-4">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 bg-sky-600 text-white font-bold text-[9px] px-2.5 py-1 rounded-lg uppercase shadow-sm">
                          {p.category}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-semibold mb-2">
                      <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {p.date}</span>
                      <span>•</span>
                      <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {p.readTime}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-800 leading-snug line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed font-semibold">
                      {p.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 text-right">
                    <button
                      onClick={() => setReadingPost(p)}
                      className="w-full text-center bg-sky-50 text-[#0077B6] hover:bg-sky-100 font-extrabold text-xs py-2 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                      Leer Artículo Completo
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="bg-white rounded-3xl p-12 border border-dashed text-center text-slate-400 max-w-lg mx-auto mt-6">
                <p className="text-xs font-semibold">No se encontraron artículos que coincidan con los filtros de búsqueda.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
