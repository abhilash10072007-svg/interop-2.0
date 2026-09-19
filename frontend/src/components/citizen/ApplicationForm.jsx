import React, { useEffect, useState } from 'react';

import {
  GraduationCap,
  Car,
  Check,
  ArrowLeft,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

import { useApp } from '../../context/AppContext';


// ============================================================
// APPLICATION FORM
// ============================================================

export const ApplicationForm = () => {

  const {
    user,
    citizenId,
    createApplication,
    setActiveTab,
    eligibilityData,
    consents
  } = useApp();


  // ============================================================
  // INITIAL SERVICE
  // ============================================================

  /*
    Services.jsx should store the selected service before opening
    the Application Form.

    Example:
      sessionStorage.setItem(
        'selectedApplicationService',
        'Driving License'
      );

    We read that value here.

    If nothing exists, Education Scholarship remains the safe
    fallback.
  */

  const getInitialScheme = () => {

    const storedScheme =
      sessionStorage.getItem(
        'selectedApplicationService'
      );

    const allowedSchemes = [
      'Education Scholarship',
      'Driving License',
      'Student Assistance',
      'Income Certificate',
      'Caste Certificate',
      'Vehicle Registration',
      'Personal Loan'
    ];

    if (
      storedScheme &&
      allowedSchemes.includes(storedScheme)
    ) {
      return storedScheme;
    }

    return 'Education Scholarship';
  };


  // ============================================================
  // STATE
  // ============================================================

  

  const [selectedScheme, setSelectedScheme] =
    useState(getInitialScheme);

  const [currentStep, setCurrentStep] =
    useState(1);

  const [duplicateApplication, setDuplicateApplication] = useState(null);

  const [eligibilityFailure, setEligibilityFailure] =
    useState(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submissionResult, setSubmissionResult] =
    useState(null);


  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    mobile: '',
    email: '',
    aadhaar: 'XXXX-XXXX-XXXX',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    institution: 'SKCET',
    course: 'B.Com',
    annualIncome: '',
    docUploaded: true,
    consentAgreed: true
  });


  // ============================================================
  // UPDATE SERVICE WHEN FORM OPENS
  // ============================================================

  useEffect(() => {

    const storedScheme =
      sessionStorage.getItem(
        'selectedApplicationService'
      );

    if (storedScheme) {

      setSelectedScheme(
        storedScheme
      );

    }

  }, []);


  // ============================================================
  // UPDATE FORM WHEN CITIZEN CHANGES
  // ============================================================

  useEffect(() => {

    if (!user) {
      return;
    }

    setFormData((previous) => ({
      ...previous,

      fullName:
        user.name || '',

      dob:
        user.dob || '',

      gender:
        user.gender || '',

      mobile:
        user.mobile ||
        user.phone ||
        '',

      email:
        user.email || '',

      aadhaar:
        user.aadhaarNumber ||
        'XXXX-XXXX-XXXX',

      addressLine:
        user.address || '',

      city:
        user.address || '',

      state:
        'Tamil Nadu'
    }));

  }, [user]);


  // ============================================================
  // SERVICE TYPE HELPERS
  // ============================================================

  const isDrivingLicense =
    selectedScheme === 'Driving License';

  const isEducationScholarship =
    selectedScheme === 'Education Scholarship';

  const isStudentAssistance =
    selectedScheme === 'Student Assistance';

  const isIncomeCertificate =
    selectedScheme === 'Income Certificate';

  const isCasteCertificate =
    selectedScheme === 'Caste Certificate';

  const isVehicleRegistration =
    selectedScheme === 'Vehicle Registration';

  const isPersonalLoan =
    selectedScheme === 'Personal Loan';


  // ============================================================
  // STEPS
  // ============================================================

  const steps = [
    {
      num: 1,
      title: 'Scheme & Identity'
    },
    {
      num: 2,
      title: 'Eligibility Details'
    },
    {
      num: 3,
      title: 'InterOp Verification'
    },
    {
      num: 4,
      title: 'Review & Submit'
    }
  ];


  // ============================================================
  // REQUIRED CONSENTS
  // ============================================================

  const requiredConsents = (() => {

    /*
      Education Scholarship and Student Assistance need
      Education + Income department access.
    */

    if (
      isEducationScholarship ||
      isStudentAssistance
    ) {
      return [
        {
          dataProvider:
            'Education Department',

          dataType:
            'Education',

          purpose:
            selectedScheme,

          label:
            'Education Department'
        },

        {
          dataProvider:
            'Income Department',

          dataType:
            'Income',

          purpose:
            selectedScheme,

          label:
            'Income Department'
        }
      ];
    }


    /*
      Driving License needs Transport-related verification.
      For the current prototype, the actual eligibility checks
      are performed by the backend using learner license,
      medical fitness and Aadhaar records.
    */

    if (isDrivingLicense) {
      return [];
    }


    if (isIncomeCertificate) {
      return [];
    }


    if (isCasteCertificate) {
      return [];
    }


    if (isVehicleRegistration) {
      return [];
    }


    if (isPersonalLoan) {
      return [];
    }


    return [];

  })();


  // ============================================================
  // FIND MISSING CONSENTS
  // ============================================================

  const missingConsents = (() => {

    /*
      If the backend already returned missing consents,
      use those first.
    */

    if (
      eligibilityData &&
      Array.isArray(
        eligibilityData.missing_consents
      )
    ) {

      return eligibilityData.missing_consents;

    }


    /*
      Education Scholarship / Student Assistance
      require Education + Income consent.
    */

    if (
      requiredConsents.length === 0
    ) {
      return [];
    }


    const safeConsents =
      Array.isArray(consents)
        ? consents
        : [];


    return requiredConsents.filter(
      (required) => {

        const found =
          safeConsents.some(
            (consent) => {

              const provider =
                String(
                  consent.data_provider ||
                  consent.dataProvider ||
                  consent.department ||
                  ''
                )
                  .trim()
                  .toLowerCase();


              const type =
                String(
                  consent.data_type ||
                  consent.dataType ||
                  consent.category ||
                  ''
                )
                  .trim()
                  .toLowerCase();


              const purpose =
                String(
                  consent.purpose ||
                  ''
                )
                  .trim()
                  .toLowerCase();


              const status =
                String(
                  consent.status ||
                  ''
                )
                  .trim()
                  .toUpperCase();


              if (
                status !== 'GRANTED'
              ) {
                return false;
              }


              const providerMatches =
                provider ===
                  required.dataProvider
                    .toLowerCase()
                ||
                provider.includes(
                  required.dataProvider
                    .toLowerCase()
                );


              const typeMatches =
                type ===
                  required.dataType
                    .toLowerCase()
                ||
                type.includes(
                  required.dataType
                    .toLowerCase()
                );


              const purposeMatches =
                !purpose ||
                purpose ===
                  required.purpose
                    .toLowerCase();


              return (
                providerMatches &&
                typeMatches &&
                purposeMatches
              );

            }
          );


        return !found;

      }
    );

  })();


  // ============================================================
  // CONSENT STATE
  // ============================================================

  const hasMissingConsent =
    missingConsents.length > 0;


  const eligibilityChecked =
    eligibilityData?.eligibility_checked === true;


  const isEligible =
    eligibilityData?.eligible === true;


  // ============================================================
  // SERVICE ICON
  // ============================================================

  const getServiceIcon = () => {

    if (isDrivingLicense) {
      return (
        <Car className="w-6 h-6" />
      );
    }

    return (
      <GraduationCap className="w-6 h-6" />
    );

  };


  // ============================================================
  // HANDLE SERVICE CHANGE
  // ============================================================

  const handleSchemeChange = (event) => {

    const newScheme =
      event.target.value;

    setSelectedScheme(
      newScheme
    );

    sessionStorage.setItem(
      'selectedApplicationService',
      newScheme
    );

    setCurrentStep(1);
setSubmissionResult(null);
setEligibilityFailure(null);
setDuplicateApplication(null);

  };


  // ============================================================
  // HANDLE NEXT
  // ============================================================

  const handleNext = async () => {

    // ----------------------------------------------------------
    // MOVE TO NEXT STEP
    // ----------------------------------------------------------

    if (currentStep < 4) {

      setCurrentStep(
        (previous) =>
          previous + 1
      );

      return;
    }


    // ----------------------------------------------------------
    // STEP 4 - SUBMIT
    // ----------------------------------------------------------

    if (!formData.consentAgreed) {

      setSubmissionResult({
        application_submitted: false,
        message:
          'Please agree to the application declaration before submitting.'
      });

      return;
    }


    // ----------------------------------------------------------
    // CLEAR OLD RESULTS
    // ----------------------------------------------------------

    setEligibilityFailure(null);
setSubmissionResult(null);
setDuplicateApplication(null);

setIsSubmitting(true);


    try {

      console.log(
        '======================================'
      );

      console.log(
        'APPLICATION FORM SUBMISSION'
      );

      console.log(
        'Citizen ID:',
        citizenId
      );

      console.log(
        'Selected Service:',
        selectedScheme
      );

      console.log(
        'Operation:',
        'APPLY'
      );

      console.log(
        '======================================'
      );


      /*
        IMPORTANT:

        serviceName is explicitly sent to AppContext.

        AppContext then sends:

          scheme_name = selectedScheme

        to:

          POST /api/applications/submit
      */

      const result =
        await createApplication({

          serviceName:
            selectedScheme,

          operation:
            'APPLY',

          category:
            isDrivingLicense
              ? 'Transport & Vehicles'
              : isIncomeCertificate
              ? 'Revenue & Land Administration'
              : isCasteCertificate
              ? 'Backward Classes & Community Welfare'
              : isVehicleRegistration
              ? 'Transport & Vehicles'
              : isPersonalLoan
              ? 'Public Financial Institutions Network'
              : 'Social Welfare & Education',

          ...formData

        });
        // ============================================================
// DUPLICATE APPLICATION RESPONSE
// ============================================================

if (result?.duplicate_application) {
  setDuplicateApplication(
    result.existing_application || null
  );

  setSubmissionResult(null);
  setEligibilityFailure(null);

  return;
}


      console.log(
        'APPLICATION FORM RESULT:',
        result
      );


      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      if (
        result?.application_submitted === true
      ) {

        setSubmissionResult(
          result
        );

        return;
      }


      // --------------------------------------------------------
      // STORE RESULT
      // --------------------------------------------------------

      setSubmissionResult(
        result
      );


      // --------------------------------------------------------
      // EXTRACT ELIGIBILITY
      // --------------------------------------------------------

      const reasons =
        Array.isArray(
          result?.reasons
        )
          ? result.reasons
          : Array.isArray(
              result?.eligibility?.reasons
            )
            ? result.eligibility.reasons
            : [];


      const criteria =
        result?.criteria ||
        result?.eligibility?.criteria ||
        null;


      const eligibilityMessage =
        result?.message ||
        result?.eligibility?.message ||
        'Citizen is not eligible for this service.';


      // --------------------------------------------------------
      // ELIGIBILITY FAILURE
      // --------------------------------------------------------

      if (
        result?.eligible === false ||
        result?.eligibility?.eligible === false ||
        reasons.length > 0
      ) {

        setEligibilityFailure({

          message:
            eligibilityMessage,

          reasons:
            reasons,

          criteria:
            criteria

        });

        return;
      }


      // --------------------------------------------------------
      // CONSENT FAILURE
      // --------------------------------------------------------

      if (
        Array.isArray(
          result?.missing_consents
        ) &&
        result.missing_consents.length > 0
      ) {

        return;

      }


      // --------------------------------------------------------
      // GENERIC FAILURE
      // --------------------------------------------------------

      if (
        result?.application_submitted === false
      ) {

        return;

      }

    } catch (error) {

      console.error(
        'Application submission error:',
        error
      );


      const errorResult = {

        application_submitted:
          false,

        message:
          error?.message ||
          'Application submission failed.',

        reasons: []

      };


      setSubmissionResult(
        errorResult
      );

    } finally {

      setIsSubmitting(
        false
      );

    }

  };


  // ============================================================
  // PREVIOUS
  // ============================================================

  const handlePrev = () => {

    if (currentStep > 1) {

      setCurrentStep(
        (previous) =>
          previous - 1
      );

      return;
    }

    setActiveTab(
      'services'
    );

  };


  // ============================================================
  // GO TO CONSENT MANAGEMENT
  // ============================================================

  const goToConsentManagement = () => {

    setActiveTab(
      'consent'
    );

  };


  // ============================================================
  // CLOSE ELIGIBILITY FAILURE
  // ============================================================

  const closeEligibilityFailure = () => {

    setEligibilityFailure(
      null
    );

  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="max-w-4xl mx-auto space-y-6 pb-12">


      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="light-card flex items-center justify-between p-5 rounded-2xl shadow-xs">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shadow-2xs">

            {getServiceIcon()}

          </div>


          <div>

            <h1 className="text-xl font-bold text-slate-900">

              {selectedScheme}
              {' '}
              Application

            </h1>


            <p className="text-xs text-slate-500 mt-0.5">

              GovSync Multi-Department
              Interoperability Gateway
              {' • '}
              Citizen Ref:

              <span className="font-mono font-bold text-orange-600 ml-1">

                {citizenId || '--'}

              </span>

            </p>

          </div>

        </div>


        {/* ==================================================== */}
        {/* SCHEME SELECTOR */}
        {/* ==================================================== */}

        <select
          value={
            selectedScheme
          }
          onChange={
            handleSchemeChange
          }
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-orange-500"
        >

          <option value="Education Scholarship">
            Education Scholarship
          </option>

          <option value="Student Assistance">
            Student Assistance
          </option>

          <option value="Driving License">
            Driving License
          </option>

          <option value="Income Certificate">
            Income Certificate
          </option>

          <option value="Caste Certificate">
            Caste Certificate
          </option>

          <option value="Vehicle Registration">
            Vehicle Registration
          </option>

          <option value="Personal Loan">
            Personal Loan
          </option>

        </select>

      </div>


      {/* ====================================================== */}
      {/* STEPPER */}
      {/* ====================================================== */}

      <div className="light-card p-4 rounded-2xl shadow-xs overflow-x-auto">

        <div className="flex items-center justify-between min-w-[500px] px-4">

          {steps.map((step) => {

            const completed =
              currentStep >
              step.num;

            const active =
              currentStep ===
              step.num;


            return (

              <React.Fragment
                key={step.num}
              >

                <div className="flex items-center gap-2.5">

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      completed
                        ? 'bg-emerald-500 text-white'
                        : active
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >

                    {completed ? (

                      <Check className="w-4 h-4" />

                    ) : (

                      step.num

                    )}

                  </div>


                  <span
                    className={`text-xs font-semibold ${
                      active
                        ? 'text-orange-600'
                        : completed
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >

                    {step.title}

                  </span>

                </div>


                {step.num < 4 && (

                  <div className="flex-1 h-0.5 mx-3 bg-slate-200" />

                )}

              </React.Fragment>

            );

          })}

        </div>

      </div>


      {/* ====================================================== */}
      {/* MAIN CARD */}
      {/* ====================================================== */}

      <div className="light-card p-6 md:p-8 rounded-2xl shadow-xs space-y-6">


        {/* ==================================================== */}
        {/* STEP 1 */}
        {/* ==================================================== */}

        {currentStep === 1 && (

          <div className="space-y-5">

            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">

              Step 1: Verified Citizen
              Demographics

            </h2>


            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">

              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />

              <div>

                <p className="text-xs font-bold text-blue-900">

                  Citizen information retrieved
                  through GovSync

                </p>

                <p className="text-xs text-blue-800 mt-1">

                  The details below are populated
                  from the live citizen record.

                </p>

              </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1">

                  Full Legal Name

                </label>

                <input
                  type="text"
                  value={
                    formData.fullName
                  }
                  onChange={
                    (event) =>
                      setFormData({
                        ...formData,
                        fullName:
                          event.target.value
                      })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                />

              </div>


              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1">

                  Date of Birth

                </label>

                <input
                  type="date"
                  value={
                    formData.dob
                  }
                  onChange={
                    (event) =>
                      setFormData({
                        ...formData,
                        dob:
                          event.target.value
                      })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                />

              </div>


              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1">

                  Citizen Reference

                </label>

                <input
                  type="text"
                  disabled
                  value={
                    citizenId || ''
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-orange-600"
                />

              </div>


              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1">

                  Mobile Number

                </label>

                <input
                  type="text"
                  value={
                    formData.mobile
                  }
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold"
                />

              </div>


              <div className="md:col-span-2">

                <label className="block text-xs font-semibold text-slate-600 mb-1">

                  Address

                </label>

                <input
                  type="text"
                  value={
                    formData.addressLine
                  }
                  onChange={
                    (event) =>
                      setFormData({
                        ...formData,
                        addressLine:
                          event.target.value
                      })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                />

              </div>

            </div>

          </div>

        )}


        {/* ==================================================== */}
        {/* STEP 2 */}
        {/* ==================================================== */}

        {currentStep === 2 && (

          <div className="space-y-5">

            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">

              Step 2: Eligibility Details

            </h2>


            {isDrivingLicense ? (

              <div className="space-y-4">

                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">

                  <p className="text-xs font-bold text-sky-900">

                    Driving License Eligibility

                  </p>

                  <p className="text-xs text-sky-800 mt-1">

                    GovSync will verify the learner
                    license, medical fitness and Aadhaar
                    address directly from connected
                    department records.

                  </p>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <label className="block text-xs font-semibold text-slate-600 mb-1">

                      License Type

                    </label>

                    <input
                      type="text"
                      value="LMV"
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold"
                    />

                  </div>


                  <div>

                    <label className="block text-xs font-semibold text-slate-600 mb-1">

                      Applicant Age

                    </label>

                    <input
                      type="text"
                      disabled
                      value={
                        eligibilityData?.criteria?.age ??
                        'Verified by backend'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold"
                    />

                  </div>

                </div>

              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1">

                    Educational Institution

                  </label>

                  <input
                    type="text"
                    value={
                      formData.institution
                    }
                    onChange={
                      (event) =>
                        setFormData({
                          ...formData,
                          institution:
                            event.target.value
                        })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  />

                </div>


                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1">

                    Course / Degree

                  </label>

                  <input
                    type="text"
                    value={
                      formData.course
                    }
                    onChange={
                      (event) =>
                        setFormData({
                          ...formData,
                          course:
                            event.target.value
                        })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  />

                </div>


                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1">

                    Annual Household Income

                  </label>

                  <div className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">

                    Verified from Income Department

                  </div>

                </div>


                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1">

                    Scholarship Income Limit

                  </label>

                  <input
                    type="text"
                    disabled
                    value="₹2,50,000 / year"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold"
                  />

                </div>

              </div>

            )}


            {/* Eligibility result */}

            {eligibilityChecked && (

              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isEligible
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >

                {isEligible ? (

                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />

                ) : (

                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />

                )}


                <div>

                  <p
                    className={`text-xs font-bold ${
                      isEligible
                        ? 'text-emerald-800'
                        : 'text-amber-800'
                    }`}
                  >

                    {isEligible
                      ? 'Eligibility Verified'
                      : hasMissingConsent
                      ? 'Eligibility Waiting for Consent'
                      : 'Eligibility Requirements Not Met'}

                  </p>


                  <p
                    className={`text-xs mt-1 ${
                      isEligible
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }`}
                  >

                    {eligibilityData?.message ||
                      'Eligibility information is being checked through GovSync.'}

                  </p>

                </div>

              </div>

            )}

          </div>

        )}


        {/* ==================================================== */}
        {/* STEP 3 */}
        {/* ==================================================== */}

        {currentStep === 3 && (

          <div className="space-y-5">

            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">

              Step 3: InterOp Verification

            </h2>


            {isDrivingLicense ? (

              <>

                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3">

                  <Car className="w-5 h-5 text-sky-600 shrink-0" />

                  <div>

                    <p className="text-xs font-bold text-sky-900">

                      Transport Department Verification

                    </p>

                    <p className="text-xs text-sky-800 mt-1">

                      Connected department records will
                      be checked automatically by GovSync.

                    </p>

                  </div>

                </div>


                <div className="space-y-3">


                  {[
                    {
                      label:
                        'Learner License',
                      value:
                        eligibilityData?.criteria
                          ?.learner_license_valid
                    },

                    {
                      label:
                        'Learner License Duration',
                      value:
                        eligibilityData?.criteria
                          ?.learner_license_days,
                      suffix:
                        ' days'
                    },

                    {
                      label:
                        'Medical Fitness',
                      value:
                        eligibilityData?.criteria
                          ?.medical_fitness
                    },

                    {
                      label:
                        'Aadhaar Address Match',
                      value:
                        eligibilityData?.criteria
                          ?.aadhaar_address_match
                    }

                  ].map(
                    (item) => {

                      const verified =
                        item.value === true ||
                        (
                          typeof item.value ===
                            'number' &&
                          item.value > 0
                        );


                      return (

                        <div
                          key={
                            item.label
                          }
                          className={`p-4 rounded-xl border flex items-center justify-between ${
                            verified
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >

                          <span className="text-xs font-bold text-slate-800">

                            {item.label}

                          </span>


                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              verified
                                ? 'text-emerald-700 bg-white border border-emerald-200'
                                : 'text-slate-500 bg-white border border-slate-200'
                            }`}
                          >

                            {verified
                              ? (
                                <>
                                  VERIFIED
                                  {item.suffix || ''}
                                </>
                              )
                              : 'PENDING'}

                          </span>

                        </div>

                      );

                    }
                  )}

                </div>

              </>

            ) : (

              <>

                {/* Education Department */}

                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    missingConsents.some(
                      (consent) =>
                        consent.dataProvider ===
                        'Education Department'
                    )
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-emerald-50 border-emerald-200'
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        missingConsents.some(
                          (consent) =>
                            consent.dataProvider ===
                            'Education Department'
                        )
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >

                      <FileText className="w-5 h-5" />

                    </div>


                    <div>

                      <p className="text-xs font-bold text-slate-900">

                        Education Department

                      </p>

                      <p className="text-[11px] text-slate-500">

                        Education records

                      </p>

                    </div>

                  </div>


                  {missingConsents.some(
                    (consent) =>
                      consent.dataProvider ===
                      'Education Department'
                  ) ? (

                    <span className="text-[10px] font-bold text-amber-700 bg-white border border-amber-200 px-2.5 py-1 rounded-full">

                      CONSENT REQUIRED

                    </span>

                  ) : (

                    <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2.5 py-1 rounded-full">

                      GRANTED ✓

                    </span>

                  )}

                </div>


                {/* Income Department */}

                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    missingConsents.some(
                      (consent) =>
                        consent.dataProvider ===
                        'Income Department'
                    )
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-emerald-50 border-emerald-200'
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        missingConsents.some(
                          (consent) =>
                            consent.dataProvider ===
                            'Income Department'
                        )
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >

                      <FileText className="w-5 h-5" />

                    </div>


                    <div>

                      <p className="text-xs font-bold text-slate-900">

                        Income Department

                      </p>

                      <p className="text-[11px] text-slate-500">

                        Income records

                      </p>

                    </div>

                  </div>


                  {missingConsents.some(
                    (consent) =>
                      consent.dataProvider ===
                      'Income Department'
                  ) ? (

                    <span className="text-[10px] font-bold text-amber-700 bg-white border border-amber-200 px-2.5 py-1 rounded-full">

                      CONSENT REQUIRED

                    </span>

                  ) : (

                    <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2.5 py-1 rounded-full">

                      GRANTED ✓

                    </span>

                  )}

                </div>


                {hasMissingConsent && (

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">

                    <div className="flex items-start gap-3">

                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

                      <div className="flex-1">

                        <p className="text-xs font-bold text-amber-900">

                          Consent Required

                        </p>

                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">

                          GovSync cannot verify your
                          eligibility until permission is
                          granted to access the required
                          department records.

                        </p>


                        <div className="mt-3 space-y-2">

                          {missingConsents.map(
                            (consent) => (

                              <div
                                key={
                                  consent.dataProvider
                                }
                                className="flex items-center justify-between bg-white border border-amber-200 rounded-lg px-3 py-2.5"
                              >

                                <div>

                                  <p className="text-xs font-bold text-slate-800">

                                    {consent.label ||
                                      consent.dataProvider}

                                  </p>

                                  <p className="text-[11px] text-slate-500">

                                    Access required:
                                    {' '}
                                    {consent.dataType}
                                    {' '}records

                                  </p>

                                </div>


                                <span className="text-[10px] font-bold text-red-600">

                                  NOT GRANTED

                                </span>

                              </div>

                            )
                          )}

                        </div>


                        <button
                          type="button"
                          onClick={
                            goToConsentManagement
                          }
                          className="mt-4 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all"
                        >

                          Grant Required Consent

                        </button>

                      </div>

                    </div>

                  </div>

                )}


                {!hasMissingConsent && (

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">

                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />

                    <div>

                      <p className="text-xs font-bold text-emerald-900">

                        InterOp Verification Ready

                      </p>

                      <p className="text-xs text-emerald-800 mt-1">

                        Required department consents are
                        available.

                      </p>

                    </div>

                  </div>

                )}

              </>

            )}


            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs flex items-center gap-2">

              <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />

              <span>

                Zero physical document uploads are required
                for this interoperability verification.

              </span>

            </div>

          </div>

        )}


        {/* ==================================================== */}
        {/* STEP 4 */}
        {/* ==================================================== */}

        {currentStep === 4 && (

          <div className="space-y-5">

            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">

              Step 4: Review Application & Submit to FastAPI

            </h2>


            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Applicant Name:
                </span>

                <span className="font-bold text-slate-900">
                  {formData.fullName}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-slate-500">
                  Citizen Reference:
                </span>

                <span className="font-mono font-bold text-orange-600">
                  {citizenId}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-slate-500">
                  Service:
                </span>

                <span className="font-bold text-slate-900">
                  {selectedScheme}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-slate-500">
                  Operation:
                </span>

                <span className="font-bold text-orange-600">
                  APPLY
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-slate-500">
                  Reviewing Authority:
                </span>

                <span className="font-bold text-slate-900">

                  {isDrivingLicense
                    ? 'Transport Department'
                    : 'State Welfare Department'}

                </span>

              </div>

            </div>


            {/* ================================================= */}
            {/* CONSENT STATUS */}
            {/* ================================================= */}

            {hasMissingConsent ? (

              <div className="p-4 rounded-xl bg-red-50 border border-red-200">

                <div className="flex items-start gap-3">

                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />


                  <div className="flex-1">

                    <p className="text-xs font-bold text-red-800">

                      Application Cannot Be Submitted

                    </p>


                    <p className="text-xs text-red-700 mt-1 leading-relaxed">

                      The application is blocked because
                      required department consent has not
                      been granted.

                    </p>


                    <div className="mt-3 space-y-2">

                      {missingConsents.map(
                        (consent) => (

                          <div
                            key={
                              consent.dataProvider
                            }
                            className="flex items-center justify-between bg-white border border-red-200 rounded-lg px-3 py-2.5"
                          >

                            <div>

                              <p className="text-xs font-bold text-slate-800">

                                {consent.label ||
                                  consent.dataProvider}

                              </p>

                              <p className="text-[11px] text-slate-500">

                                Required access:
                                {' '}
                                {consent.dataType}
                                {' '}records

                              </p>

                            </div>


                            <span className="text-[10px] font-bold text-red-600">

                              NOT GRANTED

                            </span>

                          </div>

                        )
                      )}

                    </div>


                    <button
                      type="button"
                      onClick={
                        goToConsentManagement
                      }
                      className="mt-3 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
                    >

                      Go to Consent Management

                    </button>

                  </div>

                </div>

              </div>

            ) : (

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">

                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />

                <div>

                  <p className="text-xs font-bold text-emerald-900">

                    InterOp Consent Active

                  </p>

                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">

                    Required verification permissions are
                    available.

                  </p>

                </div>

              </div>

            )}
            {/* ================================================= */}
{/* DUPLICATE APPLICATION RESULT */}
{/* ================================================= */}

{duplicateApplication && (

  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">

    <div className="flex items-start gap-3">

      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

      <div className="flex-1">

        <p className="text-xs font-bold text-amber-900">
          Application Already Exists
        </p>

        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
          You already have an active application for this
          service. A new application cannot be submitted
          while the existing application is active.
        </p>


        <div className="mt-3 bg-white border border-amber-200 rounded-lg p-3">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* Application ID */}
            <div>

              <p className="text-[10px] font-bold uppercase text-slate-500">
                Application ID
              </p>

              <p className="mt-1 text-xs font-mono font-bold text-slate-900">
                {duplicateApplication.application_id || '--'}
              </p>

            </div>


            {/* Scheme */}
            <div>

              <p className="text-[10px] font-bold uppercase text-slate-500">
                Scheme
              </p>

              <p className="mt-1 text-xs font-bold text-slate-900">
                {duplicateApplication.scheme_name || selectedScheme}
              </p>

            </div>


            {/* Status */}
            <div>

              <p className="text-[10px] font-bold uppercase text-slate-500">
                Status
              </p>

              <p className="mt-1 text-xs font-bold text-amber-700">
                {duplicateApplication.application_status || 'ACTIVE'}
              </p>

            </div>

          </div>


          {/* Submitted date */}

          {duplicateApplication.submitted_on && (

            <div className="mt-3 pt-3 border-t border-slate-100">

              <p className="text-[10px] font-bold uppercase text-slate-500">
                Submitted On
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-700">
                {duplicateApplication.submitted_on}
              </p>

            </div>

          )}

        </div>


        <div className="mt-3 flex items-center gap-2">

          <CheckCircle2 className="w-4 h-4 text-amber-600" />

          <p className="text-[11px] text-amber-800">
            Please track your existing application instead
            of submitting another application.
          </p>

        </div>

      </div>

    </div>

  </div>

)}

            {/* ================================================= */}
            {/* BACKEND SUBMISSION RESULT */}
            {/* ================================================= */}

            {submissionResult &&
              submissionResult.application_submitted !==
                true && (

                <div className="p-4 rounded-xl bg-red-50 border border-red-200">

                  <div className="flex items-start gap-3">

                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />


                    <div className="flex-1">

                      <p className="text-xs font-bold text-red-800">

                        Submission Failed

                      </p>


                      {(
                        submissionResult
                          .missing_consents ||
                        []
                      ).length > 0 ? (

                        <>

                          <p className="text-xs text-red-700 mt-1">

                            Required consent is missing:

                          </p>


                          <div className="mt-3 space-y-2">

                            {submissionResult
                              .missing_consents
                              .map(
                                (consent) => (

                                  <div
                                    key={
                                      consent.dataProvider
                                    }
                                    className="bg-white border border-red-200 rounded-lg px-3 py-2"
                                  >

                                    <p className="text-xs font-bold text-slate-800">

                                      {consent.label ||
                                        consent.dataProvider}

                                    </p>

                                    <p className="text-[11px] text-slate-500">

                                      {consent.dataType}
                                      {' '}records
                                      {' '}permission not granted

                                    </p>

                                  </div>

                                )
                              )}

                          </div>


                          <button
                            type="button"
                            onClick={
                              goToConsentManagement
                            }
                            className="mt-3 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
                          >

                            Grant Missing Consent

                          </button>

                        </>

                      ) : (

                        <p className="text-xs text-red-700 mt-1">

                          {submissionResult.message ||
                            'Application submission failed.'}

                        </p>

                      )}

                    </div>

                  </div>

                </div>

              )}


            {/* ================================================= */}
            {/* DECLARATION */}
            {/* ================================================= */}

            <div className="flex items-start gap-3">

              <input
                type="checkbox"
                checked={
                  formData.consentAgreed
                }
                onChange={
                  (event) =>
                    setFormData({
                      ...formData,
                      consentAgreed:
                        event.target.checked
                    })
                }
                className="mt-1 accent-orange-500"
              />


              <p className="text-xs text-slate-600 leading-relaxed">

                I agree to submit this application
                through the GovSync Interoperability
                Gateway and authorize processing of the
                application using the permissions granted
                to the required departments.

              </p>

            </div>

          </div>

        )}


        {/* ==================================================== */}
        {/* NAVIGATION */}
        {/* ==================================================== */}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">


          <button
            type="button"
            onClick={
              handlePrev
            }
            disabled={
              isSubmitting
            }
            className="btn-press flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-50"
          >

            <ArrowLeft className="w-4 h-4" />

            <span>

              {currentStep === 1
                ? 'Back to Services'
                : 'Previous Step'}

            </span>

          </button>


          <button
            type="button"
            onClick={
              handleNext
            }
            disabled={
              isSubmitting
            }
            className={`btn-press flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md ${
              isSubmitting
                ? 'bg-orange-300 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25'
            }`}
          >

            {isSubmitting ? (

              <>

                <RefreshCw className="w-4 h-4 animate-spin" />

                <span>
                  Submitting...
                </span>

              </>

            ) : (

              <>

                <span>

                  {currentStep === 4
                    ? 'Confirm & Submit to FastAPI'
                    : 'Continue'}

                </span>

                <ArrowRight className="w-4 h-4" />

              </>

            )}

          </button>

        </div>

      </div>


      {/* ====================================================== */}
      {/* ELIGIBILITY FAILURE MODAL */}
      {/* ====================================================== */}

      {eligibilityFailure && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">


            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">

                <AlertCircle className="h-6 w-6 text-red-600" />

              </div>


              <div>

                <h2 className="text-xl font-bold text-gray-900">

                  Application Cannot Be Submitted

                </h2>

                <p className="text-sm text-gray-500">

                  {selectedScheme}

                </p>

              </div>

            </div>


            <div className="mb-5 rounded-xl bg-red-50 p-4 border border-red-100">

              <p className="font-medium text-red-800">

                {eligibilityFailure.message}

              </p>

            </div>


            {eligibilityFailure.reasons.length > 0 && (

              <div className="mb-5">

                <h3 className="mb-3 font-semibold text-gray-900">

                  Why you are not eligible

                </h3>


                <div className="space-y-2">

                  {eligibilityFailure.reasons.map(
                    (reason, index) => (

                      <div
                        key={index}
                        className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >

                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">

                          {index + 1}

                        </span>


                        <p className="text-sm text-gray-700">

                          {reason}

                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


            {eligibilityFailure.criteria && (

              <div className="mb-5 rounded-xl border border-gray-200 p-4">

                <h3 className="mb-3 font-semibold text-gray-900">

                  Eligibility Details

                </h3>


                {eligibilityFailure.criteria.age !== undefined && (

                  <div className="flex justify-between py-1.5 text-sm">

                    <span className="text-gray-500">

                      Age

                    </span>

                    <span className="font-medium">

                      {
                        eligibilityFailure
                          .criteria
                          .age
                      }

                    </span>

                  </div>

                )}


                {eligibilityFailure.criteria.income_limit !== undefined && (

                  <div className="flex justify-between py-1.5 text-sm">

                    <span className="text-gray-500">

                      Income limit

                    </span>

                    <span className="font-medium">

                      ₹
                      {Number(
                        eligibilityFailure.criteria.income_limit
                      ).toLocaleString('en-IN')}

                    </span>

                  </div>

                )}


                {eligibilityFailure.criteria.annual_income !== undefined && (

                  <div className="flex justify-between py-1.5 text-sm">

                    <span className="text-gray-500">

                      Annual income

                    </span>

                    <span className="font-medium">

                      ₹
                      {Number(
                        eligibilityFailure.criteria.annual_income
                      ).toLocaleString('en-IN')}

                    </span>

                  </div>

                )}


                {eligibilityFailure.criteria.required_student_status && (

                  <div className="flex justify-between py-1.5 text-sm">

                    <span className="text-gray-500">

                      Required student status

                    </span>

                    <span className="font-medium">

                      {
                        eligibilityFailure
                          .criteria
                          .required_student_status
                      }

                    </span>

                  </div>

                )}


                {eligibilityFailure.criteria.student_status && (

                  <div className="flex justify-between py-1.5 text-sm">

                    <span className="text-gray-500">

                      Current student status

                    </span>

                    <span className="font-medium">

                      {
                        eligibilityFailure
                          .criteria
                          .student_status
                      }

                    </span>

                  </div>

                )}


                {eligibilityFailure.criteria.education_consent !== undefined && (

                  <div className="flex justify-between py-1.5 text-sm">

                    <span className="text-gray-500">

                      Education consent

                    </span>

                    <span
                      className={
                        eligibilityFailure
                          .criteria
                          .education_consent
                          ? 'font-semibold text-emerald-600'
                          : 'font-semibold text-red-600'
                      }
                    >

                      {
                        eligibilityFailure
                          .criteria
                          .education_consent
                          ? 'Granted'
                          : 'Not granted'
                      }

                    </span>

                  </div>

                )}


                {eligibilityFailure.criteria.income_consent !== undefined && (

                  <div className="flex justify-between py-1.5 text-sm">

                    <span className="text-gray-500">

                      Income consent

                    </span>

                    <span
                      className={
                        eligibilityFailure
                          .criteria
                          .income_consent
                          ? 'font-semibold text-emerald-600'
                          : 'font-semibold text-red-600'
                      }
                    >

                      {
                        eligibilityFailure
                          .criteria
                          .income_consent
                          ? 'Granted'
                          : 'Not granted'
                      }

                    </span>

                  </div>

                )}


                {eligibilityFailure.criteria.learner_license_valid !== undefined && (

                  <div className="flex justify-between py-1.5 text-sm">

                    <span className="text-gray-500">

                      Learner License

                    </span>

                    <span className="font-semibold">

                      {
                        eligibilityFailure
                          .criteria
                          .learner_license_valid
                          ? 'Valid'
                          : 'Invalid'
                      }

                    </span>

                  </div>

                )}


                {eligibilityFailure.criteria.medical_fitness !== undefined && (

                  <div className="flex justify-between py-1.5 text-sm">

                    <span className="text-gray-500">

                      Medical Fitness

                    </span>

                    <span className="font-semibold">

                      {
                        eligibilityFailure
                          .criteria
                          .medical_fitness
                          ? 'Fit'
                          : 'Not Fit'
                      }

                    </span>

                  </div>

                )}


                {eligibilityFailure.criteria.aadhaar_address_match !== undefined && (

                  <div className="flex justify-between py-1.5 text-sm">

                    <span className="text-gray-500">

                      Aadhaar Address Match

                    </span>

                    <span className="font-semibold">

                      {
                        eligibilityFailure
                          .criteria
                          .aadhaar_address_match
                          ? 'Matched'
                          : 'Not Matched'
                      }

                    </span>

                  </div>

                )}

              </div>

            )}


            <button
              type="button"
              onClick={
                closeEligibilityFailure
              }
              className="w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-800"
            >

              Close

            </button>

          </div>

        </div>

      )}

    </div>

  );

};


export default ApplicationForm;