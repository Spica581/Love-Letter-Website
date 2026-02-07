import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function LetterView() {
	const { id } = useParams();
	const [letter, setLetter] = useState(null);

	useEffect(() => {
		let mounted = true;
		axios.get(`/api/letters/${id}`).then((res) => {
			if (mounted) setLetter(res.data);
		}).catch(() => {});
		return () => (mounted = false);
	}, [id]);

	if (!letter) return <div className="p-4">Loading letter...</div>;

	return (
		<div className="p-4">
			<h1>{letter.title || 'Letter'}</h1>
			<pre>{letter.content}</pre>
		</div>
	);
}
