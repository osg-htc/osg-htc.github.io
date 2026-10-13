import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import AlphafoldStats from '@/components/services/osdf/AlphafoldStats';
import { AlphafoldSearch } from '@/components/services/osdf/AlphafoldSearch';

export const metadata: Metadata = {
  alternates: { canonical: '/services/osdf/alphafold' },
  title: 'AlphaFold3 Alignment Library — OSG Consortium',
  description:
    'A growing OSDF-hosted library of reusable AlphaFold3 multiple sequence alignments for structure prediction workflows.',
};

const SCOPE: [string, string][] = [
  ['Primary artifact', 'Protein-chain unpaired MSA files in A3M format.'],
  [
    'Cache key',
    'Normalized protein sequence hash, with one or more alignment records allowed per sequence when sources or provenance differ.',
  ],
  [
    'Distribution',
    'Alignment files are stored in an OSDF namespace and retrieved through Pelican-aware clients or normal OSDF access patterns.',
  ],
  [
    'Registry metadata',
    'Sequence identifier, source, OSDF URI, checksum, size, number of aligned sequences, timestamps, and generation/provenance fields.',
  ],
  [
    'Sources',
    'OSPool-generated AlphaFold3 data-pipeline outputs, curated imported alignment sets, and validated institutional or community contributions.',
  ],
  [
    'Organism information',
    'Derived from source metadata when available. Organism counts describe annotated source organisms, not a guarantee that each sequence is organism-unique.',
  ],
];

export default function Page() {
  return (
    <Box>
      <Container maxWidth='md' sx={{ pt: 5, textAlign: 'center' }}>
        <Typography variant='h2' component='h1' fontWeight='bold' gutterBottom>
          AlphaFold3 Alignment Library
        </Typography>
        <Typography variant='h6' component='p' color='text.secondary'>
          A growing OSDF-hosted library of reusable AlphaFold3 multiple sequence
          alignments for structure prediction workflows.
        </Typography>
      </Container>

      <Box sx={{ bgcolor: 'grey.100', my: 5, py: 2 }}>
        <Container maxWidth='md'>
          <AlphafoldStats />
          <Box textAlign='center'>
            <Button href='#how-can-i-contribute' variant='contained' color='secondary'>
              Contribute your alignments!
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth='md' sx={{ '& p': { mb: 2 } }}>
        <Typography>
          Running AlphaFold2 at scale can be challenging because jobs often spend
          a long time preparing inputs before structure prediction begins,
          including searching large reference databases to build alignments. The
          AlphaFold3 Alignment Library helps reduce this repeated work by allowing
          compatible OSPool workflows to reuse precomputed alignments when they
          are already available.
        </Typography>

        <Typography variant='h4' component='h2' gutterBottom mt={4}>
          What is the AlphaFold3 Alignment Library?
        </Typography>
        <Typography>
          The AlphaFold3 Alignment Library is a shared index and OSDF namespace
          for precomputed multiple sequence alignments (MSAs) that can be reused
          by cache-aware AlphaFold3 workflows running on the OSPool. The initial
          focus is protein-chain unpaired MSAs in A3M format, which are the
          alignment artifacts most useful for skipping repeated CPU-heavy sequence
          search work before GPU inference.
        </Typography>
        <Typography>
          Each record links a normalized protein sequence hash to an alignment
          file, its OSDF/Pelican location, checksum, source, size, sequence count,
          and provenance metadata about how the alignment was generated.
        </Typography>
        <Box textAlign='center' my={3}>
          <Button
            href='https://portal.osg-htc.org/documentation/'
            variant='contained'
            color='secondary'
          >
            Read the documentation
          </Button>
        </Box>
        <Paper
          variant='outlined'
          sx={{ p: 2, bgcolor: 'grey.100', borderLeft: 4, borderColor: 'primary.main', mb: 3 }}
        >
          <Typography>
            <strong>Rollout note:</strong> This library is currently being grown
            and tested as cache-aware AlphaFold3 workflows are introduced on the
            OSPool. If you are interested in using or contributing to the library,
            please contact{' '}
            <Link href='mailto:support@osg-htc.org?subject=AlphaFold%203%20alignment%20library%20contribution'>
              support@osg-htc.org
            </Link>
            .
          </Typography>
        </Paper>

      </Container>

      <Container maxWidth='lg' sx={{ '& p': { mb: 2 } }}>
        <Typography variant='h4' component='h2' gutterBottom mt={4} id='search-the-library'>
          Search the library
        </Typography>
        <Typography>
          Check whether the library already holds alignments for your protein
          chains. Paste one or more sequences below in FASTA format (a{' '}
          <code>&gt;name</code> header followed by the sequence) or simply one
          sequence per line — or drag and drop FASTA file(s) onto the form — then
          search. Sequences are hashed in your browser and only the hashes are sent
          to the registry, so the sequences themselves never leave your computer.
        </Typography>
        <AlphafoldSearch />
      </Container>

      <Container maxWidth='md' sx={{ '& p': { mb: 2 } }}>
        <Typography variant='h4' component='h2' gutterBottom mt={4}>
          Why cache alignments?
        </Typography>
        <Typography>
          AlphaFold3 workflows often spend substantial CPU time in the data
          pipeline searching large sequence databases to build MSAs. The alignment
          library reduces duplicated work by allowing those precomputed alignments
          to be reused when the sequence, source, and provenance are appropriate
          for the user&rsquo;s workflow.
        </Typography>
        <ul>
          <li>
            <strong>Faster cache-aware runs</strong> — jobs that find an acceptable
            cached MSA can skip part or all of the repeated sequence-search stage.
          </li>
          <li>
            <strong>Lower CPU and storage pressure</strong> — repeated database
            searches are replaced with OSDF/Pelican reads of smaller artifacts.
          </li>
          <li>
            <strong>Reproducibility and provenance</strong> — cached records
            include source and checksum metadata.
          </li>
          <li>
            <strong>Community reuse</strong> — every validated contribution can
            make later structure-prediction workflows faster for researchers.
          </li>
        </ul>

        <Typography variant='h4' component='h2' gutterBottom mt={4}>
          Current scope
        </Typography>
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableBody>
              {SCOPE.map(([item, desc]) => (
                <TableRow key={item}>
                  <TableCell component='th' sx={{ fontWeight: 'bold', width: '30%' }}>
                    {item}
                  </TableCell>
                  <TableCell>{desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant='h4' component='h2' gutterBottom mt={4} id='how-can-i-contribute'>
          How can I contribute alignments?
        </Typography>
        <Typography>
          Contributing to the library is as easy as running AlphaFold3 using the
          OSG-provided workflow on your own sequences. Caching of alignments
          happens automatically when you run the workflow on the OSPool, and your
          generated alignments will be added to the library&rsquo;s registry and
          made available for reuse.
        </Typography>
        <Paper variant='outlined' sx={{ p: 2, bgcolor: 'grey.100', textAlign: 'center', my: 3 }}>
          <Typography fontWeight='bold'>
            Already have a set of pre-computed alignments you&rsquo;d like to
            share? Connect with a Facilitator at{' '}
            <Link href='mailto:support@osg-htc.org?subject=AlphaFold%203%20alignment%20library%20contribution'>
              support@osg-htc.org
            </Link>
          </Typography>
        </Paper>
      </Container>

      {/* Powered-by footer */}
      <Container maxWidth='lg' sx={{ pb: 5 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            mt: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href='https://pelicanplatform.org'>
              <ExportedImage
                src='/images/logos/PelicanPlatformLogo_Icon.png'
                alt='Pelican Logo'
                width={200}
                height={200}
                style={{ width: 80, height: 'auto' }}
              />
            </Link>
            <Typography variant='h5' component='p'>
              Powered by <Link href='https://pelicanplatform.org'>Pelican Platform</Link>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href='https://path-cc.io'>
              <ExportedImage
                src='/images/logos/Logo_Round_Med.png'
                alt='PATh Logo'
                width={300}
                height={300}
                style={{ width: 80, height: 'auto' }}
              />
            </Link>
            <Typography variant='h5' component='p'>
              Operated by <Link href='https://path-cc.io'>PATh</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
