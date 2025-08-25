export default function EditCardModal({
	open,
	saving,
	error,
	title,
	description,
	onClose,
	onChangeTitle,
	onChangeDescription,
	onSubmit,
}) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />
			<div className="relative z-10 w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
				<h3 className="text-lg font-semibold mb-3">Edit Card</h3>

				<form onSubmit={onSubmit} className="space-y-3">
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Title <span className="text-red-500">*</span>
						</label>
						<input
							autoFocus
							type="text"
							value={title}
							onChange={onChangeTitle}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
						/>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
						<textarea
							rows={3}
							value={description}
							onChange={onChangeDescription}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
						/>
					</div>

					{error ? <p className="text-sm text-red-600">{error}</p> : null}

					<div className="mt-2 flex items-center gap-2">
						<button
							type="submit"
							disabled={saving}
							className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
						>
							{saving ? "Saving..." : "Save"}
						</button>
						<button
							type="button"
							onClick={onClose}
							disabled={saving}
							className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
